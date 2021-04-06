/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { neutralFillToggleFocusBehavior } from '@microsoft/fast-components';
import { WidgetGeneralError } from '../../../widgets/src';
import { shaka as shaka_player } from './shaka';
import { ForwardButton, FullscreenButton, MuteButton, OverflowMenu, PlayButton, RewindButton } from './UI/buttons.class';
import {
    ForwardButtonFactory,
    FullscreenButtonFactory,
    LiveButtonFactory,
    MuteButtonFactory,
    OverflowMenuFactory,
    PlayButtonFactory,
    RewindButtonFactory
} from './UI/buttons.factory';
const shaka = require('shaka-player/dist/shaka-player.ui.debug.js');
export class Player {
    private isLive = true;
    private _accessToken = '';
    private player: shaka_player.Player = Object.create(null);
    private controls: any;
    private timestampOffset: number;

    public set liveStream(value: string) {
        this._liveStream = value;
    }

    public set vodStream(value: string) {
        this._vodStream = value;
    }

    public constructor(
        private video: HTMLVideoElement,
        private videoContainer: HTMLElement,
        private _liveStream: string,
        private _vodStream: string,
        private timeUpdateCallback: (time: string) => void
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

    public play() {
        this.video.play();
    }

    public set accessToken(accessToken: string) {
        this._accessToken = accessToken;
    }

    public async load(url: string, play = false) {
        try {
            await this.player.load(url);

            if (play) {
                this.video.play();
            }
        } catch (error) {
            throw new WidgetGeneralError(error.message);
        }
    }

    public async toggleLiveMode(isLive: boolean) {
        if (isLive) {
            await this.load(this._liveStream, true);
        } else {
            await this.load(this._vodStream, true);
        }
        this.isLive = isLive;
        document.dispatchEvent(new CustomEvent('player_live', { detail: this.isLive }));

        // think on better solution
        this.controls.elements_[5].isLive = this.isLive;
        this.controls.elements_[5].button_.classList.add(this.isLive ? 'live-on' : 'live-off');
        this.controls.elements_[5].button_.classList.remove(this.isLive ? 'live-off' : 'live-on');
    }

    private createButton() {
        return document.createElement('fast-button');
    }

    private addUILayer() {
        shaka.util.Dom.createButton = this.createButton;

        shaka.ui.PlayButton = PlayButton;
        shaka.ui.PlayButton.Factory = PlayButtonFactory;
        shaka.ui.Controls.registerElement('play_pause', new shaka.ui.PlayButton.Factory());

        shaka.ui.FastForwardButton = ForwardButton;
        shaka.ui.FastForwardButton.Factory = ForwardButtonFactory;
        shaka.ui.Controls.registerElement('fast_forward', new shaka.ui.FastForwardButton.Factory());

        shaka.ui.RewindButton = RewindButton;
        shaka.ui.RewindButton.Factory = RewindButtonFactory;
        shaka.ui.Controls.registerElement('rewind', new shaka.ui.RewindButton.Factory());

        shaka.ui.FullscreenButton = FullscreenButton;
        shaka.ui.FullscreenButton.Factory = FullscreenButtonFactory;
        shaka.ui.Controls.registerElement('fullscreen', new shaka.ui.FullscreenButton.Factory());

        shaka.ui.MuteButton = MuteButton;
        shaka.ui.MuteButton.Factory = MuteButtonFactory;
        shaka.ui.Controls.registerElement('mute', new shaka.ui.MuteButton.Factory());

        shaka.ui.OverflowMenu = OverflowMenu;
        shaka.ui.OverflowMenu.Factory = OverflowMenuFactory;
        shaka.ui.Controls.registerElement('overflow_menu', new shaka.ui.OverflowMenu.Factory());

        LiveButtonFactory.callBack = async (isLive: boolean) => {
            this.toggleLiveMode(isLive);
            // document.dispatchEvent(new CustomEvent('player_live', { detail: this.isLive }));
        };
        shaka.ui.Controls.registerElement('live', new LiveButtonFactory());
    }

    private init() {
        this.addUILayer();

        // Getting reference to video and video container on DOM
        // Initialize shaka player
        this.player = new shaka.Player(this.video);

        const uiConfig = {
            controlPanelElements: [
                'rewind',
                'play_pause',
                'fast_forward',
                'live',
                'mute',
                'volume',
                // 'time_and_duration',
                'spacer',
                'overflow_menu',
                'fullscreen'
            ],
            addBigPlayButton: false,
            overflowMenuButtons: ['playback_rate', 'captions', 'quality', 'language', 'cast'],
            seekBarColors: {
                base: 'rgba(255, 255, 255, 0.3)',
                buffered: 'rgba(0, 255, 255, 0.54)',
                played: '#F3F2F1'
            }
        };

        // Set up authentication handler
        this.player.getNetworkingEngine().registerRequestFilter(this.authenticationHandler);
        // Setting up shaka player UI
        const ui = new shaka.ui.Overlay(this.player, this.videoContainer, this.video);
        ui.configure(uiConfig);
        this.controls = ui.getControls();
        this.controls.bottomControls_.insertBefore(
            this.controls.bottomControls_.childNodes[2],
            this.controls.bottomControls_.childNodes[1]
        );

        // Listen for error events.
        this.player.addEventListener('error', this.onErrorEvent.bind(this));
        this.player.addEventListener('trackschanged', this.onTrackChange.bind(this));

        this.controls.addEventListener('timeandseekrangeupdated', this.onTimeSeekUpdate.bind(this));

        this.player.addEventListener('emsg', this.onShakaMetadata.bind(this));

        // Load live first
        // if (this.isLive) {
        //     this.load(this._liveStream, true);
        // } else {
        //     this.load(this._vodStream, false);
        // }

        this.toggleLiveMode(this.isLive);
    }

    private authenticationHandler(type: shaka_player.net.NetworkingEngine.RequestType, request: shaka_player.extern.Request) {
        if (!this._accessToken) {
            return;
        }

        // Add authentication
        if (
            type === shaka_player.net.NetworkingEngine.RequestType.MANIFEST ||
            type === shaka_player.net.NetworkingEngine.RequestType.SEGMENT
        ) {
            request.headers['Authentication'] = `Bearer  ${this._accessToken}`;
        }
    }

    private onShakaMetadata(event: shaka_player.PlayerEvents.EmsgEvent) {
        const emsg = event.detail;
        // we are only interested in AVA metadata.
        if (emsg.schemeIdUri === 'urn:msft:media:ava:event:2020:json') {
            const inference = this.parseEmsg(emsg);
            console.log(inference);
        }
    }

    private parseEmsg(emsg: any) {
        const decoder = new TextDecoder();
        const message = decoder.decode(emsg.messageData);
        const inferences = JSON.parse(message).inferences;
        // console.log(`received inferences time ${emsg.startTime}=>${emsg.endTime} ${message}`);
        return {
            startTime: emsg.startTime,
            endTime: emsg.endTime,
            value: inferences,
            track: emsg.value // the track name shows which inference track this inference bleongs to.
        };
    }

    private async onTrackChange() {
        // Get player manifest
        const manifest = this.player.getManifest();
        const variant = manifest.variants[0];
        const stream = variant.video || variant.audio;
        if (!stream.segmentIndex) {
            await stream.createSegmentIndex();
        }
        const segmentIndex = stream.segmentIndex;
        const index = segmentIndex.find(0) || 0;
        const reference = segmentIndex.get(index);
        if (reference) {
            this.timestampOffset = reference.timestampOffset * -1000;
        }
    }

    private onTimeSeekUpdate() {
        // Extract the shaka.util.Error object from the event.
        // console.log(event);
        const displayTime = this.controls.getDisplayTime();
        const time = this.computeClock(displayTime, true);
        this.timeUpdateCallback(time);
    }

    private computeClock(time: number, showDate: boolean) {
        const date = new Date(this.timestampOffset + time * 1000);
        return `${showDate ? date.toLocaleDateString() : ''} ${date.toLocaleTimeString()}`;
    }

    private onErrorEvent(event: shaka_player.PlayerEvents.ErrorEvent) {
        // Extract the shaka.util.Error object from the event.
        this.onError(event.detail);
    }

    private onError(error: shaka_player.util.Error) {
        throw new WidgetGeneralError(error.code);
    }
}
