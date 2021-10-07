/* eslint-disable max-len */
import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { IAvailableMediaResponse } from '../../../common/services/media/media.definitions';
import { SegoeUIFontFamily } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { WidgetGeneralError } from '../../../widgets/src';
import { Logger } from '../../../widgets/src/common/logger';
import { IUISegment, IUISegmentEventData } from '../segments-timeline/segments-timeline.definitions';
import { TimelineComponent } from '../timeline';
import { ITimeLineConfig, TimelineEvents } from '../timeline/timeline.definitions';
import { ControlPanelElements, LiveState } from './player-component.definitions';
import { shaka as shaka_player } from './shaka';
import { AVAPlayerUILayer } from './UI/ava-ui-layer.class';
import { BoundingBoxDrawer } from './UI/bounding-box.class';
import { extractRealTime } from './UI/time.utils';
import { createTimelineSegments } from './UI/timeline.utils';
import { extractRealTimeFromISO } from './UI/time.utils';
import { shaka } from './index';
import { Localization } from './../../../common/services/localization/localization.class';
import { IDictionary } from '../../../common/services/localization/localization.definitions';
import { MediaApi } from '../../../common/services/media/media-api.class';
import { MimeType } from './player-component.definitions';

/* eslint-disable @typescript-eslint/no-unused-expressions */
TimelineComponent;
Localization;

// When using shaka.PlayerInterface.onError to report errors, we sometimes
// need to be able to pass codes which are not defined in
// shaka.util.Error.Code.
enum ErrorCode {
    WEBSOCKET_CLOSED = 1500, // data = [ CloseEvent.code, CloseEvent.reason, CloseEvent.wasClean ]
    WEBSOCKET_OPEN = 1501, // data = [ errorMsg, errorObj ]
}

interface IShakaErrorHandlerConfig {
    resetSource: () => Promise<void>;
    autoreconnect?: boolean;
}

class shakaErrorHandler {
    private _resetSource: () => Promise<void>;
    private _autoreconnect: boolean;

    private _firstVideoError = 0;
    private _numVideoErrors = 0;

    public constructor(config: IShakaErrorHandlerConfig) {
        this._resetSource = config.resetSource;
        this._autoreconnect = config.autoreconnect ?? true;
    }

    // This is async, but caller will
    // Porting to widgets, had to change from event: Event to event:any
    // because @types/react declares Event interface which overrides lib.dom.
    public async onShakaError(event: shaka_player.PlayerEvents.ErrorEvent): Promise<boolean> {
        if (!('type' in event) || !('detail' in event)) {
            throw new Error('onShakaError: event not recognized! No type or detail: ' +
                JSON.stringify(event)
            );
        }

        if (event.type !== 'error') {
            throw new Error(
                `onShakaError: event not recognized! Type = ${event.type}!`
            );
        }

        const shakaError = event.detail as shaka_player.util.Error;
        if (!shakaError) {
            throw new Error(
                'onShakaError: event.detail not provided! ' +
                `event.type = ${event.type}, ${event}`
            );
        }

        // Log the error
        Logger.error(
            'onShakaError: code',
            shakaError.code,
            `, ${shakaError.message}, object: ${shakaError}`
        );

        if (shakaError.code === ErrorCode.WEBSOCKET_CLOSED) {
            if (this._autoreconnect) {
                if (shakaError.severity === shaka.util.Error.Severity.RECOVERABLE) {
                    event.stopImmediatePropagation(); // Must call BEFORE await or else dispatch loop will keep notifying
                    await this._resetSource();
                    return true;
                }
            }
            return false;
        }

        if (shakaError.code === 3016) {
            // VIDEO_ERROR, typically PIPELINE_ERROR_DECODE / VDA Error 4
            const maxVideoErrors = 10; // Max retries will be 1 less than this number
            const maxVideoErrorMinutes = 3;

            const now = Date.now();
            let secondsSinceFirstVideoError = (now - this._firstVideoError) / 1000;
            if (secondsSinceFirstVideoError > 60 * maxVideoErrorMinutes) {
                if (this._firstVideoError > 0) {
                    Logger.log(
                        `${secondsSinceFirstVideoError} elapsed since first video error, resetting count.`
                    );
                }
                this._numVideoErrors = 0;
                this._firstVideoError = now;
                secondsSinceFirstVideoError = 0;
            }

            this._numVideoErrors += 1;
            const logMsgPrefix = `Encountered ${this._numVideoErrors} video errors within the last ${secondsSinceFirstVideoError} seconds!`;
            if (this._numVideoErrors >= maxVideoErrors) {
                Logger.error(logMsgPrefix, 'No more reloads!');
                return false;
            }

            Logger.log(logMsgPrefix, 'Reloading player.');
            try {
                event.stopImmediatePropagation(); // Must call BEFORE await or else dispatch loop will keep notifying
                await this._resetSource();
                Logger.log('Reload complete!');
                return true;
            } catch (e) {
                Logger.error(`Reload FAILED with error: ${e}`);
                throw e;
            }
        }

        // If we reached this point, we did not recognize and therefore did
        // not handle the error.
        return false;
    }
}


export class PlayerWrapper {
    public player: shaka_player.Player = Object.create(null);
    public resources: IDictionary;

    private isLive = false;
    private isClip = false;
    private isLoaded = false;
    private duringSegmentJump = false;
    private _accessToken = '';
    private _mimeType: MimeType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private controls: any;
    private _allowCrossCred = true;
    private timestampOffset: number;
    private firstSegmentStartSeconds: number;
    private date: Date;
    private timelineComponent: TimelineComponent;
    private boundingBoxesDrawer: BoundingBoxDrawer;
    private segmentIndex: shaka_player.media.SegmentIndex;
    private onSegmentChangeListenerRef: (event: CustomEvent) => void;
    private avaUILayer: AVAPlayerUILayer;
    private _liveStream: string = '';
    private _vodStream: string = '';
    private _availableSegments: IAvailableMediaResponse = null;
    private currentSegment: IUISegment = null;
    private isPlaying: boolean = false;
    private _stallDetectionTimer: number | null = null;
    private _driftCorrectionTimer: number | null = null;
    private _firstVideoError: number = 0;
    private _numVideoErrors: number = 0;
    private wallclock_event: shaka_player.PlayerEvents.FakeEvent | undefined;
    private _errorHandler: shakaErrorHandler;

    private readonly OFFSET_MULTIPLAYER = 1000;
    private readonly SECONDS_IN_HOUR = 3600;
    private readonly SECONDS_IN_MINUTES = 60;
    private readonly DEFAULT_FONT_SIZE = '10px';

    public constructor(
        private video: HTMLVideoElement,
        private videoContainer: HTMLElement,
        private timeUpdateCallback: (time: Date, timeString: string) => void,
        private isLiveCallback: (isLive: boolean) => void,
        private changeDayCallBack: (isNext: boolean) => void,
        private errorCallback: (error: shaka_player.PlayerEvents.ErrorEvent) => void,
        private allowedControllers: ControlPanelElements[],
        private onClickLiveCallback: (isLive: boolean) => void
    ) {
        this.resources = Localization.dictionary;
        // Install built-in polyfills to patch browser incompatibilities.
        shaka.polyfill.installAll();

        // Check to see if the browser supports the basic APIs Shaka needs.
        if (shaka.Player.isBrowserSupported()) {
            // Everything looks good!
            this.init();
        } else {
            // This browser does not have the minimum set of APIs we need.
            throw new WidgetGeneralError(this.resources.PLAYER_BrowserNotSupported);
        }
    }

    public set availableSegments(value: IAvailableMediaResponse) {
        this._availableSegments = value;
    }

    public set liveStream(value: string) {
        this._liveStream = value;
    }

    public set vodStream(value: string) {
        this._vodStream = value;
    }

    public set allowCrossCred(value: boolean) {
        this._allowCrossCred = value;
    }

    public get allowCrossCred() {
        return this._allowCrossCred;
    }

    public set mimeType(value: MimeType) {
        this._mimeType = value;
    }

    public get mimeType() {
        return this._mimeType;
    }

    public getMimeType(url: string): MimeType | undefined {
        if (url.startsWith('ws')) {
            return 'application/rtsp';
        }
        return undefined;
    }

    public pause() {
        this.video.pause();
    }

    public play() {
        this.video.play();
    }

    public set accessToken(accessToken: string) {
        this._accessToken = accessToken;
    }

    public get accessToken() {
        return this._accessToken;
    }

    public async load(url: string) {
        this.isLoaded = false;
        this.timestampOffset = undefined;
        try {
            await this.player.load(url, null, this.getMimeType(url));
            this.isLoaded = true;
            // Auto play video
            this.video.play();
        } catch (error: unknown) {
            if (error instanceof Error) {
                Logger.log(error.message);
            } else {
                throw error;
            }
        }
    }

    public async destroy() {
        // Player listeners
        this.player?.removeEventListener('error', this.onErrorEvent.bind(this));
        this.player?.removeEventListener('trackschanged', this.onTrackChange.bind(this));

        this.player?.removeEventListener('emsg', this.onShakaMetadata.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.player as any).removeEventListener('wallclock', this.onWallclock.bind(this));

        // Video listeners
        this.video?.removeEventListener('timeupdate', this.onTimeSeekUpdate.bind(this));
        this.video?.removeEventListener('loadeddata', this.onLoadedData.bind(this));
        this.video?.removeEventListener('seeked', this.onSeeked.bind(this));
        this.video?.removeEventListener('play', this.onPlaying.bind(this));
        this.video?.removeEventListener('pause', this.onPause.bind(this));

        // Log media events to improve the usefulness of the logs (both Shaka and video)
        this.player?.removeEventListener('onstatechange', this.onStateChange.bind(this));
        this.player?.removeEventListener('onstateidle', this.onStateIdle.bind(this));
        this.player?.removeEventListener('buffering', this.onBuffering.bind(this));
        this.player?.removeEventListener('loading', this.onLoading.bind(this));
        this.player?.removeEventListener('loaded', this.onLoaded.bind(this));
        this.player?.removeEventListener('unloading', this.onUnloading.bind(this));
        this.player?.removeEventListener('largegap', this.onLargeGap.bind(this));
        this.video?.removeEventListener('stalled', this.onStalled.bind(this));
        this.video?.removeEventListener('suspend', this.onSuspend.bind(this));
        this.video?.removeEventListener('waiting', this.onWaiting.bind(this));

        if (this._stallDetectionTimer !== null) {
            window.clearInterval(this._stallDetectionTimer);
            this._stallDetectionTimer = null;
        }

        if (this._driftCorrectionTimer !== null) {
            window.clearInterval(this._driftCorrectionTimer);
            this._driftCorrectionTimer = null;
        }

        // Remove BB
        if (this.boundingBoxesDrawer) {
            this.removeBoundingBoxLayer();
            this.boundingBoxesDrawer.destroy();
        }

        // Remove timeline
        this.removeTimelineComponent();

        if (this.isLoaded) {
            this.video.pause();
            this.video.src = '';
            await this.player?.unload();
        }
        this.isLoaded = false;
    }

    public async onClickLive(isLive: boolean) {
        this.isLive = isLive;
        await this.onClickLiveCallback(isLive);
        if (isLive) {
            await this.load(this._liveStream);
            this.removeTimelineComponent();
            this.video.play();
        }
        if (this.boundingBoxesDrawer) {
            this.boundingBoxesDrawer.clearInstances();
        }
        this.isLiveCallback(this.isLive);

        this.updateLiveButtonState();
        this.updateControlsClassList();
    }

    public async toggleLiveMode(isLive: boolean) {
        this.isLive = isLive;
        if (isLive) {
            await this.load(this._liveStream);
            this.removeTimelineComponent();
            this.video.play();
        } else {
            await this.load(this._vodStream);
        }
        if (this.boundingBoxesDrawer) {
            this.boundingBoxesDrawer.clearInstances();
        }
        this.isLiveCallback(this.isLive);

        this.updateLiveButtonState();
        this.updateControlsClassList();
        return this.player.isLive();
    }

    public toggleClipMode(isClip: boolean) {
        this.isClip = isClip;
        this.removeTimelineComponent();
        if (!this.isClip) {
            this.createTimelineComponent();
        }
    }

    public retryStreaming() {
        this.player.retryStreaming();
        this.play();
    }

    private updateLiveButtonState() {
        for (const element of this.controls?.elements_) {
            if (element?.isLiveButton) {
                element.updateLiveState(this.isLive);
            }
        }
    }

    private updateControlsClassList() {
        this.controls?.controlsContainer_?.classList.add(this.isLive ? LiveState.ON : LiveState.OFF);
        this.controls?.controlsContainer_?.classList.remove(this.isLive ? LiveState.OFF : LiveState.ON);
    }

    private removeTimelineComponent() {
        if (this.timelineComponent) {
            this.controls.bottomControls_.removeChild(this.timelineComponent);
            // eslint-disable-next-line no-undef
            this.timelineComponent.removeEventListener(TimelineEvents.SEGMENT_CHANGE, this.onSegmentChangeListenerRef as EventListener);
            // eslint-disable-next-line no-undef
            this.timelineComponent.removeEventListener(TimelineEvents.SEGMENT_START, this.onSegmentStart.bind(this) as EventListener);
            this.timelineComponent = null;
        }
    }

    private getSeekRangeString() {
        return `seekRange=${JSON.stringify(this.player.seekRange())}`;
    }

    private createTimelineComponent() {
        const segments = createTimelineSegments(this._availableSegments);

        const date = new Date(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate(), 0, 0, 0);

        const enableZoom = this.allowedControllers ? this.allowedControllers.indexOf(ControlPanelElements.TIMELINE_ZOOM) > -1 : true;
        const timelineConfig: ITimeLineConfig = {
            segments: segments,
            date: date,
            disableZoom: !enableZoom
        };
        this.timelineComponent = new TimelineComponent(() => {
            this.avaUILayer.addTimelineSeekBarTooltip(this.timelineComponent, this.video, this.computeClockWithSegmentOffset.bind(this));
        });
        this.controls.bottomControls_.insertBefore(this.timelineComponent, this.controls.bottomControls_.childNodes[2]);
        this.onSegmentChangeListenerRef = this.onSegmentChange.bind(this);
        // eslint-disable-next-line no-undef
        this.timelineComponent.addEventListener(TimelineEvents.SEGMENT_CHANGE, this.onSegmentChangeListenerRef as EventListener);
        // eslint-disable-next-line no-undef
        this.timelineComponent.addEventListener(TimelineEvents.SEGMENT_START, this.onSegmentStart.bind(this) as EventListener);
        this.timelineComponent.config = timelineConfig;

        // We expect server to return 404 on manifest requests that turn out to be empty,
        // so we assume there will always be at least one segment.
        const firstSegmentStartSeconds = extractRealTimeFromISO(this._availableSegments?.timeRanges[0]?.start);
        Logger.log(
            'createTimelineComponent: setting firstSegmentStartSeconds to ' + `${firstSegmentStartSeconds}, ` + this.getSeekRangeString()
        );
        this.firstSegmentStartSeconds = firstSegmentStartSeconds;
    }

    private onSegmentStart(event: CustomEvent<IUISegmentEventData>) {
        event.stopPropagation();
        const segmentEventData = event.detail;
        if (segmentEventData) {
            this.currentSegment = segmentEventData.segment;
            const playbackMode: number = this.player.getPlaybackRate();
            const seconds = playbackMode > 0 ? segmentEventData.segment.startSeconds : segmentEventData.segment.endSeconds;
            const newCurrentTime = seconds + this.getVideoOffset();
            Logger.log(`onSegmentStart: jump to ${newCurrentTime}, ` + this.getSeekRangeString());
            this.video.currentTime = newCurrentTime;
            if (this.isPlaying) {
                this.video.play();
            }
            this.duringSegmentJump = false;
        }
    }

    private onSegmentChange(event: CustomEvent<IUISegmentEventData>) {
        event.stopPropagation();
        const segmentEventData = event.detail;
        if (segmentEventData) {
            this.currentSegment = event.detail.segment;
            const newCurrentTime = event.detail.time + this.getVideoOffset();
            Logger.log(`onSegmentChange: jump to ${newCurrentTime}, ` + this.getSeekRangeString());
            this.video.currentTime = newCurrentTime;
            if (this.isPlaying) {
                this.video.play();
            }
        }
    }

    private getVideoOffset() {
        // This offset, when added to a seek position expressed in seconds since today GMT 00:00,
        // will cause the start of the first segment to be mapped to start of seek range.
        return this.player.seekRange().start - this.firstSegmentStartSeconds;
    }

    private toggleBodyTracking(isOn: boolean) {
        if (isOn) {
            this.addBoundingBoxLayer();
        } else {
            this.removeBoundingBoxLayer();
        }
    }

    private jumpSegment(isNext: boolean) {
        let currentTime = this.video.currentTime;

        this.duringSegmentJump = true;
        if (isNext) {
            currentTime = this.timelineComponent.getNextSegmentTime() || currentTime;
        } else {
            currentTime = this.timelineComponent.getPreviousSegmentTime() || currentTime;
        }
        this.timelineComponent.currentTime = currentTime;
        Logger.log(`jump segment: jump to ${currentTime}`);
    }

    private onClickNextDay() {
        this.changeDayCallBack(true);
    }

    private onClickPrevDay() {
        this.changeDayCallBack(false);
    }

    private async init() {
        this.avaUILayer = new AVAPlayerUILayer(
            shaka,
            this.onClickLive.bind(this),
            this.toggleBodyTracking.bind(this),
            this.onClickNextDay.bind(this),
            this.onClickPrevDay.bind(this),
            this.jumpSegment.bind(this),
            this.allowedControllers
        );

        this._errorHandler = new shakaErrorHandler({
            resetSource: async () => {
                const assetUri = this.player.getAssetUri();
                await this.load(assetUri);
            }
        });

        // Getting reference to video and video container on DOM
        // Initialize shaka player
        this.player = new shaka.Player(this.video);

        this.player.configure({
            manifest: {
                defaultPresentationDelay: 6
            },
            streaming: {
                bufferingGoal: 30,
                jumpLargeGaps: true,
                gapDetectionThreshold: 0.5
            }
        });

        // Set up authentication handler
        this.player.getNetworkingEngine().registerRequestFilter(this.authenticationHandler.bind(this));
        // Setting up shaka player UI
        const ui = new shaka.ui.Overlay(this.player, this.videoContainer, this.video);
        ui.configure(this.avaUILayer.uiConfiguration);
        this.controls = ui.getControls();
        this.controls.bottomControls_.insertBefore(
            this.controls.bottomControls_.childNodes[2],
            this.controls.bottomControls_.childNodes[1]
        );

        // Set shaka player languages
        this.controls.getLocalization().changeLocale(Localization.locale);

        // Player listeners
        this.player.addEventListener('error', this.onErrorEvent.bind(this));
        this.player.addEventListener('trackschanged', this.onTrackChange.bind(this));
        this.player.addEventListener('emsg', this.onShakaMetadata.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.player as any).addEventListener('wallclock', this.onWallclock.bind(this));

        // Video listeners
        this.video.addEventListener('seeked', this.onSeeked.bind(this));
        this.video.addEventListener('play', this.onPlaying.bind(this));
        this.video.addEventListener('pause', this.onPause.bind(this));
        this.video.addEventListener('timeupdate', this.onTimeSeekUpdate.bind(this));
        this.video.addEventListener('loadeddata', this.onLoadedData.bind(this));

        // Log media events to improve the usefulness of the logs (both Shaka and video)
        this.player.addEventListener('onstatechange', this.onStateChange.bind(this));
        this.player.addEventListener('onstateidle', this.onStateIdle.bind(this));
        this.player.addEventListener('buffering', this.onBuffering.bind(this));
        this.player.addEventListener('loading', this.onLoading.bind(this));
        this.player.addEventListener('loaded', this.onLoaded.bind(this));
        this.player.addEventListener('unloading', this.onUnloading.bind(this));
        this.player.addEventListener('largegap', this.onLargeGap.bind(this));
        this.video.addEventListener('stalled', this.onStalled.bind(this));
        this.video.addEventListener('suspend', this.onSuspend.bind(this));
        this.video.addEventListener('waiting', this.onWaiting.bind(this));

        // Install stall detection
        let prevPosition = -1;
        let consecutiveStalls = 0;
        const stallIntervalMs = 3000;
        this._stallDetectionTimer = window.setInterval(() => {
            const video = this.player.getMediaElement() as HTMLMediaElement;
            const currPosition = video.currentTime;
            let newPrevPosition = currPosition;
            if (Math.abs(currPosition - prevPosition) <= 0.001 && !video.paused) {
                if (consecutiveStalls >= 10) {
                    Logger.log(`STALL DETECTED: Too many consecutive stalls (${consecutiveStalls}), seeking in place.`);
                    video.currentTime += 0;
                } else if (!this.player.isBuffering() || video.readyState == 4) {
                    Logger.log(
                        `STALL DETECTED: video.currentTime=${currPosition} did not change for ` +
                            `${stallIntervalMs} milliseconds, shaka.isBuffering=${this.player.isBuffering()}, ` +
                            `video.readyState=${video.readyState}, consecutiveStalls=${consecutiveStalls}.`
                    );
                    video.currentTime += 1;
                } else if (this.player.isLive()) {
                    const liveToleranceBand = 30;
                    const seekEnd = this.player.seekRange().end;
                    const consecutiveStallTime = (consecutiveStalls + 2) * (stallIntervalMs / 1000.0);
                    const wasAtLive = currPosition + consecutiveStallTime + liveToleranceBand >= seekEnd;
                    const shouldSeekToLive = consecutiveStalls >= 2;
                    Logger.log(
                        `LIVE STALL DETECTED: video.currentTime=${currPosition}, seekRange().end=${seekEnd}, ` +
                            `consecutiveStalls=${consecutiveStalls}, wasAtLive=${wasAtLive}, shouldSeekToLive=${shouldSeekToLive}.`
                    );
                    if (wasAtLive && shouldSeekToLive) {
                        video.currentTime = seekEnd;
                        newPrevPosition = seekEnd;
                    }
                }
                consecutiveStalls += 1;
            } else {
                consecutiveStalls = 0;
            }
            prevPosition = newPrevPosition;
        }, stallIntervalMs);

        // Install drift correction
        const driftIntervalMs = 5000;
        const MAX_LATENCY_WINDOW = 5000;
        this._driftCorrectionTimer = window.setInterval(() => {
            const video = this.player.getMediaElement() as HTMLMediaElement;
            if (this.player.seekRange().end - MAX_LATENCY_WINDOW > video.currentTime &&
                !video.paused && this.isLive
            ) {
                Logger.log(`Correcting drift, jumping forward ${this.player.seekRange().end - video.currentTime}`);
                video.currentTime = this.player.seekRange().end;
            }
        }, driftIntervalMs);

        // Add bounding box drawer
        const options: ICanvasOptions = {
            height: this.video.clientHeight,
            width: this.video.clientWidth,
            fontFamily: SegoeUIFontFamily,
            fontSize: this.DEFAULT_FONT_SIZE,
            lineWidth: 1
        };
        this.boundingBoxesDrawer = new BoundingBoxDrawer(options, this.video);
        this.updateControlsClassList();
    }

    private onWindowResize() {
        // Clear canvas
        this.boundingBoxesDrawer?.resize();
    }

    private addBoundingBoxLayer() {
        // Add canvas to screen
        this.videoContainer.prepend(this.boundingBoxesDrawer.canvas);
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.boundingBoxesDrawer.on();
    }

    private removeBoundingBoxLayer() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        if (this.boundingBoxesDrawer?.isOn) {
            this.videoContainer?.removeChild(this.boundingBoxesDrawer?.canvas);
            this.boundingBoxesDrawer?.off();
        }
    }

    private authenticationHandler(type: shaka_player.net.NetworkingEngine.RequestType, request: shaka_player.extern.Request) {
        request['allowCrossSiteCredentials'] = this._allowCrossCred;
        if (!this._accessToken) {
            return;
        }

        // Add authorization header
        request.headers['Authorization'] = `Bearer ${this._accessToken}`;
    }

    private onShakaMetadata(event: shaka_player.PlayerEvents.EmsgEvent) {
        const emsg = event.detail;
        // we are only interested in AVA metadata.
        if (emsg.schemeIdUri === 'urn:msft:media:ava:event:2020:json') {
            this.parseEmsg(emsg);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parseEmsg(emsg: any) {
        if (!this.boundingBoxesDrawer) {
            return;
        }
        const decoder = new TextDecoder();
        const message = decoder.decode(emsg?.messageData);
        const inferences = message ? JSON.parse(message)?.inferences : null;
        if (!inferences) {
            return;
        }
        for (const iterator of inferences) {
            if (iterator.type === 'MOTION' || iterator.type === 'ENTITY') {
                const data = iterator?.motion?.box || iterator?.entity?.box;
                if (iterator.type === 'ENTITY') {
                    data.entity = {
                        id: iterator.entity.id || iterator.sequenceId,
                        tag: iterator.entity.tag.value
                    };
                }
                this.boundingBoxesDrawer.addItem(emsg.startTime, emsg.endTime, data);
            }
        }
    }

    private async onTrackChange() {
        // Get player manifest
        if (!MediaApi.supportsMediaSource()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const date = (this.video as any).getStartDate();
            Logger.log(`video start date is ${date} ${date.getUTCDate()}`);
            this.timestampOffset = date.getTime();
        } else {
            await this.updateTimeUpdateOffset();
        }

        // If not live mode, init timeline
        if (!this.isLive && !this.isClip) {
            // Update current time
            const displayTime = this.video?.currentTime || 0;
            this.getClockTimeString(displayTime);

            // Update timeline
            this.removeTimelineComponent();
            this.createTimelineComponent();
        } else {
            // Wrap range element and add time tooltip
            this.avaUILayer.addLiveSeekBarTooltip(this.controls, this.computeClockForLive.bind(this));
            setTimeout(() => {
                this.controls?.controlsContainer_?.setAttribute('shown', this.isLive || this.isClip);
            }, 50);
        }
    }

    private async getFirstSegmentReference(): Promise<shaka_player.media.SegmentReference | null> {
        const manifest = this.player.getManifest();
        if (!manifest) {
            return null;
        }
        const variant = manifest.variants[0];
        const stream = variant.video || variant.audio;
        if (!stream.segmentIndex) {
            await stream.createSegmentIndex();
        }

        this.segmentIndex = stream.segmentIndex;
        const index = this.segmentIndex.find(0) || 0;
        return this.segmentIndex.get(index);
    }

    private async updateTimeUpdateOffset() {
        Logger.log('calculating the timestamp offset for computing wallclock');
        const reference = await this.getFirstSegmentReference();
        if (reference && isFinite(reference.timestampOffset)) {
            this.timestampOffset = reference.timestampOffset * -1000;
        } else if (this.wallclock_event) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const wallclock_event = this.wallclock_event as any;
            const offset = reference ? (reference.getStartTime() - wallclock_event.timestamp) * 1000 : 0;
            Logger.log('using wallclock to calculate timestamp offset.', wallclock_event, offset);
            this.timestampOffset = wallclock_event.ntpTimestamp + offset;
        }
    }

    private async onWallclock(event: shaka_player.PlayerEvents.FakeEvent) {
        Logger.log('Received wall clock event', event);
        this.wallclock_event = event;
        await this.updateTimeUpdateOffset();
    }

    private onPause() {
        this.isPlaying = false;
    }

    private onPlaying() {
        this.isPlaying = true;
    }

    private onSeeked() {
        if (this.isPlaying) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    private onLoadedData() {
        // If vod mode - start first segment
        if (!this.isLive) {
            Logger.log('onLoadedData: jump to 0, ' + this.getSeekRangeString());
            this.video.currentTime = 0;
        }
    }

    private onTimeSeekUpdate() {
        if (!this.isLoaded || this.duringSegmentJump) {
            return;
        }
        const displayTime = this.video?.currentTime || 0;
        this.timeUpdateCallback(this.getClockTime(displayTime), this.getClockTimeString(displayTime));

        // if theres a timeline - update time
        if (this.timelineComponent) {
            let currentTime = extractRealTime(displayTime, this.timestampOffset);

            const gapBeforeJump = 0; // 3;
            // Check if we need to go to previous / next segment
            // Get mode - rewind or forward
            const playbackMode: number = this.player.getPlaybackRate();
            if (
                playbackMode > 0 &&
                (currentTime === this.currentSegment?.endSeconds || currentTime >= this.currentSegment?.endSeconds - gapBeforeJump)
            ) {
                // Get next segment time
                currentTime = this.timelineComponent.getNextSegmentTime() || currentTime;
                Logger.log(`onTimeSeekUpdate: jump to next segment ${currentTime}`);
            } else if (
                playbackMode < 0 &&
                (currentTime === this.currentSegment?.startSeconds || currentTime <= this.currentSegment?.startSeconds - gapBeforeJump)
            ) {
                // Get prev segment time
                currentTime = this.timelineComponent.getPreviousSegmentTime(false) || currentTime;
                Logger.log(`onTimeSeekUpdate: jump to previous segment ${currentTime}`);
            }
            this.timelineComponent.currentTime = currentTime;
        }
    }

    private getClockTime(time: number) {
        if (!this.timestampOffset) {
            return null;
        }
        return new Date(this.timestampOffset + time * 1000);
    }

    private getClockTimeString(time: number, showDate = true) {
        this.date = this.getClockTime(time);
        if (this.date == null) {
            return '';
        }
        const utcDate = `${this.date.getUTCMonth() + 1}-${this.date.getUTCDate()}-${this.date.getUTCFullYear()}`;
        const hour = this.date.getUTCHours();
        const minutes = this.date.getUTCMinutes();
        const seconds = this.date.getUTCSeconds();
        const utcTime = `${(hour > 9 ? '' : '0') + hour}:${(minutes > 9 ? '' : '0') + minutes}:${(seconds > 9 ? '' : '0') + seconds}`;
        return showDate ? `${utcDate} ${utcTime}` : `${utcTime}`;
    }

    private computeClockWithSegmentOffset(time: number) {
        return this.getClockTimeString(time + this.getVideoOffset(), false);
    }

    private computeClockForLive(time: number) {
        return this.getClockTimeString(time, false);
    }

    private async onErrorEvent(event: shaka_player.PlayerEvents.ErrorEvent) {
        const errorHandled = await this._errorHandler.onShakaError(event);
        if (!errorHandled && this.errorCallback) {
            Logger.log(`onErrorEvent: ${event.detail} not handled, calling errorCallback.`);
            this.errorCallback(event);
        }
    }

    private onStateChange(event: shaka_player.PlayerEvents.StateChangeEvent) {
        Logger.log(`onStateChange: ${event.state}`);
    }

    private onStateIdle(event: shaka_player.PlayerEvents.StateIdleEvent) {
        Logger.log(`onStateIdle: ${event.state}`);
    }

    private onBuffering(event: shaka_player.PlayerEvents.BufferingEvent) {
        Logger.log(`onBuffering: ${event.buffering}`);
    }

    private onLoading(event: shaka_player.PlayerEvents.LoadingEvent) {
        Logger.log(`onLoading: ${event.type}`);
    }

    private onLoaded(event: shaka_player.PlayerEvents.LoadedEvent) {
        Logger.log(`onLoaded: ${event.type}`);
    }

    private onUnloading(event: shaka_player.PlayerEvents.UnloadingEvent) {
        Logger.log(`onUnloading: ${event.type}`);
    }

    private onLargeGap(event: shaka_player.PlayerEvents.LargeGapEvent) {
        Logger.log(`onLargeGap: type=${event.type}, currentTime=${event.currentTime}, gapSize=${event.gapSize}`);
    }

    private onStalled(event: Event) {
        Logger.log(`onStalled: ${JSON.stringify(event)}`);
    }

    private onSuspend(event: Event) {
        Logger.log(`onSuspend: ${JSON.stringify(event)}`);
    }

    private onWaiting(event: Event) {
        Logger.log(`onWaiting: type=${event.type}, timeStamp=${event.timeStamp}`);
    }
}
