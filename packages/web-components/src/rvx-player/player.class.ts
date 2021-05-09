/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { WidgetGeneralError } from '../../../widgets/src';
import { IUISegment } from '../segments-timeline/segments-timeline.definitions';
import { TimelineComponent } from '../timeline';
import { TimelineEvents } from '../timeline/timeline.definitions';
import { ControlPanelElements } from './rvx-player.definitions';
import { shaka as shaka_player } from './shaka';
import { AVAPlayerUILayer } from './UI/ava-ui-layer.class';
import { BoundingBoxDrawer } from './UI/bounding-box.class';
const shaka = require('shaka-player/dist/shaka-player.ui.debug.js');

TimelineComponent;
export class PlayerWrapper {
    private isLive = false; // TODO : when RTSP plugin will be ready, set to true
    private _accessToken = '';
    private _mimeType: MimeType;
    private player: shaka_player.Player = Object.create(null);
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

    public constructor(
        private video: HTMLVideoElement,
        private videoContainer: HTMLElement,
        private _liveStream: string,
        private _vodStream: string,
        private timeUpdateCallback: (time: string) => void,
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
            console.log(error.message);
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
        document.dispatchEvent(new CustomEvent('player_live', { detail: this.isLive }));

        // TODO : add back after RTSP plugin integration
        // this.controls.elements_[5].isLive = this.isLive;
        // this.controls.elements_[5].button_.classList.add(this.isLive ? 'live-on' : 'live-off');
        // this.controls.elements_[5].button_.classList.remove(this.isLive ? 'live-off' : 'live-on');
        this.controls.controlsContainer_.classList.add(this.isLive ? 'live-on' : 'live-off');
        this.controls.controlsContainer_.classList.remove(this.isLive ? 'live-off' : 'live-on');
    }

    private removeTimelineComponent() {
        if (this.timelineComponent) {
            this.controls.controlsContainer_.removeChild(this.timelineComponent);
            // eslint-disable-next-line no-undef
            this.timelineComponent.removeEventListener(TimelineEvents.SEGMENT_CHANGE, this.onSegmentChangeListenerRef as EventListener);
            // eslint-disable-next-line no-undef
            this.timelineComponent.removeEventListener(TimelineEvents.CURRENT_TIME_CHANGE, this.onTimeChange.bind(this) as EventListener);
            this.timelineComponent = null;
        }
    }

    private createTimelineComponent() {
        if (!this.segmentReferences) {
            return;
        }
        // go over reference
        const segments = [];
        for (const iterator of this.segmentReferences) {
            const segmentEnd = iterator.getEndTime();
            const segmentStart = iterator.getStartTime();
            // const segmentStartRange = 3600 * segments.length;
            // const segmentEndRange = 3600 * segments.length;
            if (segments.length) {
                // If the difference between two segments is less then 5 minutes - merge
                const prevSegmentEnd = segments[segments.length - 1].endSeconds;
                if (segmentStart - prevSegmentEnd <= 10) {
                    // merge
                    segments[segments.length - 1].endSeconds = segmentEnd;
                } else {
                    // add new segment
                    segments.push({
                        startSeconds: segmentStart,
                        endSeconds: segmentEnd
                    });
                }
            } else {
                // first segment
                const segment: IUISegment = {
                    startSeconds: segmentStart,
                    endSeconds: segmentEnd
                };
                segments.push(segment);
            }
            // if (segmentStart >= segmentStartRange && segmentEnd <= segmentEndRange) {
            //     const segment: IUISegment = {
            //         startSeconds: segments.length ? segments[segments.length - 1].startSeconds : segmentStart,
            //         endSeconds: segmentEnd
            //     };
            //     segments.push(segment);
            // }
        }

        const configWithZoom = {
            segments: segments,
            date: this.date
        };
        this.timelineComponent = new TimelineComponent();
        this.controls.controlsContainer_.insertBefore(this.timelineComponent, this.controls.bottomControls_);
        this.onSegmentChangeListenerRef = this.onSegmentChange.bind(this);
        // eslint-disable-next-line no-undef
        this.timelineComponent.addEventListener(TimelineEvents.SEGMENT_CHANGE, this.onSegmentChangeListenerRef as EventListener);
        // eslint-disable-next-line no-undef
        this.timelineComponent.addEventListener(TimelineEvents.CURRENT_TIME_CHANGE, this.onTimeChange.bind(this) as EventListener);
        this.timelineComponent.config = configWithZoom;
    }

    private onSegmentChange(event: CustomEvent) {
        const segment = event.detail as IUISegment;
        if (segment) {
            this.video.currentTime = segment.startSeconds + 1;
            this.video.play();
        }
    }

    private onTimeChange(event: CustomEvent<number>) {
        if (event.detail) {
            this.video.currentTime = event.detail;
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
        document.dispatchEvent(new CustomEvent('player_next_day'));
    }

    private onClickPrevDay() {
        document.dispatchEvent(new CustomEvent('player_prev_day'));
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

        await this.toggleLiveMode(this.isLive);

        // Add bounding box drawer
        const options: ICanvasOptions = {
            height: this.video.clientHeight,
            width: this.video.clientWidth
        };
        this.boundingBoxesDrawer = new BoundingBoxDrawer(options, this.video);
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

    private parseEmsg(emsg: any) {
        if (!this.boundingBoxesDrawer) {
            return;
        }
        const decoder = new TextDecoder();
        const message = decoder.decode(emsg.messageData);
        const inferences = JSON.parse(message).inferences;
        for (const iterator of inferences) {
            if (iterator.type === 'MOTION' || iterator.type === 'ENTITY') {
                const data = iterator?.motion?.box || iterator?.entity?.box;
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
        }

        // If not live mode, init timeline
        if (!this.isLive) {
            // First, update current time
            this.onTimeSeekUpdate();
            this.removeTimelineComponent();
            this.createTimelineComponent();
        }
    }

    private onTimeSeekUpdate() {
        const displayTime = this.video.currentTime;
        const time = this.computeClock(displayTime);
        this.timeUpdateCallback(time);

        // if theres a timeline - update time
        if (this.timelineComponent) {
            this.timelineComponent.currentTime = displayTime;
        }
    }

    private computeClock(time: number) {
        if (!this.timestampOffset) {
            return '';
        }
        // const date = new Date(this.timestampOffset + time * 1000);
        this.date = new Date(this.timestampOffset + time * 1000);
        return `${this.date.toLocaleDateString()} ${this.date.toLocaleTimeString()}`;
        // return `${showDate ? date.getUTCDate() : ''} ${date.toLocaleTimeString()}`;
        // return `${this.date.getUTCMonth()}/${this.date.getUTCDay()}/${this.date.getUTCFullYear()} ${this.date.getUTCHours()}:${this.date.getUTCMinutes()}:${this.date.getUTCSeconds()}`;
        // return `${showDate ? date.toLocaleDateString() : ''} ${date.toLocaleTimeString()}`;
    }

    private onErrorEvent(event: shaka_player.PlayerEvents.ErrorEvent) {
        // Extract the shaka.util.Error object from the event.
        this.onError(event.detail);
    }

    private onError(error: shaka_player.util.Error) {
        // throw new WidgetGeneralError(error.code);
        // eslint-disable-next-line no-console
        console.log(error);
    }
}
