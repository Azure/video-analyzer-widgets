/* eslint-disable max-len */
import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { IAvailableMediaResponse } from '../../../common/services/media/media.definitions';
import { WidgetGeneralError } from '../../../widgets/src';
import { Logger } from '../../../widgets/src/common/logger';
import { IUISegment, IUISegmentEventData } from '../segments-timeline/segments-timeline.definitions';
import { TimelineComponent } from '../timeline';
import { TimelineEvents } from '../timeline/timeline.definitions';
import { ControlPanelElements, LiveState } from './rvx-player.definitions';
import { shaka as shaka_player } from './shaka';
import { AVAPlayerUILayer } from './UI/ava-ui-layer.class';
import { BoundingBoxDrawer } from './UI/bounding-box.class';
import { extractRealTime } from './UI/time.utils';
import { createTimelineSegments } from './UI/timeline.utils';
const shaka = require('shaka-player/dist/shaka-player.ui.debug.js');

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
TimelineComponent;

export class PlayerWrapper {
    private isLive = false; // TODO : when RTSP plugin will be ready, set to true
    private _accessToken = '';
    private _mimeType: MimeType;
    private player: shaka_player.Player = Object.create(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private controls: any;
    private _allowCrossCred = true;
    private timestampOffset: number;
    private date: Date;
    private timelineComponent: TimelineComponent;
    private boundingBoxesDrawer: BoundingBoxDrawer;
    private segmentIndex: shaka_player.media.SegmentIndex;
    private segmentReferences: shaka_player.media.SegmentReference[];
    private onSegmentChangeListenerRef: (event: CustomEvent) => void;
    private avaUILayer: AVAPlayerUILayer;
    private _liveStream: string = '';
    private _vodStream: string = '';
    private _availableSegments: IAvailableMediaResponse = null;
    private currentSegment: IUISegment = null;
    private isPlaying: boolean = false;

    private readonly OFFSET_MULTIPLAYER = 1000;

    private readonly SECONDS_IN_HOUR = 3600;

    private readonly SECONDS_IN_MINUTES = 60;

    public constructor(
        private video: HTMLVideoElement,
        private videoContainer: HTMLElement,
        private timeUpdateCallback: (time: string) => void,
        private isLiveCallback: (isLive: boolean) => void,
        private changeDayCallBack: (isNext: boolean) => void,
        private allowedControllers: ControlPanelElements[]
    ) {
        // Install built-in polyfills to patch browser incompatibilities.
        shaka.polyfill.installAll();

        // Check to see if the browser supports the basic APIs Shaka needs.
        if (shaka.Player.isBrowserSupported()) {
            // Everything looks good!
            this.init();
        } else {
            // This browser does not have the minimum set of APIs we need.
            throw new WidgetGeneralError('Browser not supported!');
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

    public async load(url: string, play = false) {
        try {
            if (this.mimeType) {
                await this.player.load(url, null, this.mimeType);
            } else {
                await this.player.load(url);
            }

            if (play) {
                this.video.play();
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            Logger.log(error.message);
        }
    }

    public destroy() {
        this.player.unload();
        this.player.destroy();
    }

    public async toggleLiveMode(isLive: boolean) {
        if (isLive) {
            await this.load(this._liveStream, true);
            this.removeTimelineComponent();
        } else {
            await this.load(this._vodStream, true);
        }
        if (this.boundingBoxesDrawer) {
            this.boundingBoxesDrawer.clearInstances();
        }
        this.isLive = isLive;
        this.isLiveCallback(this.isLive);

        // TODO : add back after RTSP plugin integration
        // this.controls.elements_[5].isLive = this.isLive;
        // this.controls.elements_[5].button_.classList.add(this.isLive ? 'live-on' : 'live-off');
        // this.controls.elements_[5].button_.classList.remove(this.isLive ? 'live-off' : 'live-on');
        this.updateControlsClassList();
    }

    private updateControlsClassList() {
        this.controls.controlsContainer_.classList.add(this.isLive ? LiveState.ON : LiveState.OFF);
        this.controls.controlsContainer_.classList.remove(this.isLive ? LiveState.OFF : LiveState.ON);
    }

    private removeTimelineComponent() {
        if (this.timelineComponent) {
            this.controls.controlsContainer_.removeChild(this.timelineComponent);
            // eslint-disable-next-line no-undef
            this.timelineComponent.removeEventListener(TimelineEvents.SEGMENT_CHANGE, this.onSegmentChangeListenerRef as EventListener);
            // eslint-disable-next-line no-undef
            this.timelineComponent.removeEventListener(TimelineEvents.SEGMENT_START, this.onSegmentStart.bind(this) as EventListener);
            this.timelineComponent = null;
        }
    }

    private createTimelineComponent() {
        if (!this.segmentReferences) {
            return;
        }
        const segments = createTimelineSegments(this._availableSegments, this.segmentReferences, this.timestampOffset);

        const date = new Date(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate(), 0, 0, 0);
        const timelineConfig = {
            segments: segments,
            date: date
        };
        this.timelineComponent = new TimelineComponent();
        this.controls.bottomControls_.insertBefore(this.timelineComponent, this.controls.bottomControls_.childNodes[2]);
        this.onSegmentChangeListenerRef = this.onSegmentChange.bind(this);
        // eslint-disable-next-line no-undef
        this.timelineComponent.addEventListener(TimelineEvents.SEGMENT_CHANGE, this.onSegmentChangeListenerRef as EventListener);
        // eslint-disable-next-line no-undef
        this.timelineComponent.addEventListener(TimelineEvents.SEGMENT_START, this.onSegmentStart.bind(this) as EventListener);
        this.timelineComponent.config = timelineConfig;
    }

    private onSegmentStart(event: CustomEvent<IUISegmentEventData>) {
        event.stopPropagation();
        const segmentEventData = event.detail;
        if (segmentEventData) {
            const currentDate = new Date(this.timestampOffset);
            const dateInSeconds =
                currentDate.getUTCHours() * this.SECONDS_IN_HOUR +
                currentDate.getUTCMinutes() * this.SECONDS_IN_MINUTES +
                currentDate.getUTCSeconds();
            this.currentSegment = segmentEventData.segment;
            const playbackMode: number = this.player.getPlaybackRate();
            const seconds = playbackMode > 0 ? segmentEventData.segment.startSeconds + 2 : segmentEventData.segment.endSeconds - 2;
            this.video.currentTime = seconds - dateInSeconds;
            this.video.play();
        }
    }

    private onSegmentChange(event: CustomEvent<IUISegmentEventData>) {
        event.stopPropagation();
        const segmentEventData = event.detail;
        if (segmentEventData) {
            const currentDate = new Date(this.timestampOffset);
            const dateInSeconds =
                currentDate.getUTCHours() * this.SECONDS_IN_HOUR +
                currentDate.getUTCMinutes() * this.SECONDS_IN_MINUTES +
                currentDate.getUTCSeconds();
            this.currentSegment = event.detail.segment;
            this.video.currentTime = event.detail.time - dateInSeconds;
            this.video.play();
        }
    }

    private toggleBodyTracking(isOn: boolean) {
        if (isOn) {
            this.addBoundingBoxLayer();
        } else {
            this.removeBoundingBoxLayer();
        }
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
            this.toggleLiveMode.bind(this),
            this.toggleBodyTracking.bind(this),
            this.onClickNextDay.bind(this),
            this.onClickPrevDay.bind(this),
            this.allowedControllers
        );

        // Getting reference to video and video container on DOM
        // Initialize shaka player
        this.player = new shaka.Player(this.video);

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

        // Listen for error events.
        this.player.addEventListener('error', this.onErrorEvent.bind(this));
        this.player.addEventListener('trackschanged', this.onTrackChange.bind(this));

        this.player.addEventListener('emsg', this.onShakaMetadata.bind(this));

        // Add bounding box drawer
        const options: ICanvasOptions = {
            height: this.video.clientHeight,
            width: this.video.clientWidth
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
        this.videoContainer.removeChild(this.boundingBoxesDrawer.canvas);
        this.boundingBoxesDrawer.off();
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
                this.boundingBoxesDrawer.addItem(emsg.startTime, data);
            }
        }
    }

    private async onTrackChange() {
        // Get player manifest
        const manifest = this.player.getManifest();
        const variant = manifest.variants[0];
        const stream = variant.video || variant.audio;
        if (!stream.segmentIndex) {
            await stream.createSegmentIndex();
        }
        this.segmentIndex = stream.segmentIndex;

        this.segmentReferences = this.segmentIndex.references;

        const index = this.segmentIndex.find(0) || 0;
        const reference = this.segmentIndex.get(index);
        if (reference) {
            this.timestampOffset = reference.timestampOffset * -1000;
            this.video.addEventListener('timeupdate', this.onTimeSeekUpdate.bind(this));
            this.video.addEventListener('seeked', this.onSeeked.bind(this));
            this.video.addEventListener('play', this.onPlaying.bind(this));
            this.video.addEventListener('pause', this.onPause.bind(this));
        }

        // If not live mode, init timeline
        if (!this.isLive) {
            // First, update current time
            this.onTimeSeekUpdate();
            this.removeTimelineComponent();
            this.createTimelineComponent();
        }
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

    private onTimeSeekUpdate() {
        const displayTime = this.video.currentTime;
        const time = this.computeClock(displayTime);
        this.timeUpdateCallback(time);

        // if theres a timeline - update time
        if (this.timelineComponent) {
            let currentTime = extractRealTime(displayTime, this.timestampOffset);

            // Check if we need to go to previous / next segment
            // Get mode - rewind or forward
            const playbackMode: number = this.player.getPlaybackRate();
            if (
                playbackMode > 0 &&
                (currentTime === this.currentSegment?.endSeconds || currentTime >= this.currentSegment?.endSeconds - 3)
            ) {
                // Get next segment time
                currentTime = this.timelineComponent.getNextSegmentTime() || currentTime;
            } else if (
                playbackMode < 0 &&
                (currentTime === this.currentSegment?.startSeconds || currentTime <= this.currentSegment?.startSeconds - 3)
            ) {
                // Get prev segment time
                currentTime = this.timelineComponent.getPreviousSegmentTime() || currentTime;
            }
            this.timelineComponent.currentTime = currentTime;
        }
    }

    private computeClock(time: number) {
        if (!this.timestampOffset) {
            return '';
        }
        this.date = new Date(this.timestampOffset + time * 1000);
        const utcDate = `${this.date.getUTCDate()}/${this.date.getUTCMonth() + 1}/${this.date.getUTCFullYear()}`;
        const hour = this.date.getUTCHours();
        const minutes = this.date.getUTCMinutes();
        const seconds = this.date.getUTCSeconds();
        const utcTime = `${(hour > 9 ? '' : '0') + hour}:${(minutes > 9 ? '' : '0') + minutes}:${(seconds > 9 ? '' : '0') + seconds}`;
        return `${utcDate} ${utcTime}`;
    }

    private onErrorEvent(event: shaka_player.PlayerEvents.ErrorEvent) {
        // Extract the shaka.util.Error object from the event.
        // eslint-disable-next-line no-console
        Logger.log(event.detail);
    }
}
