/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { styles } from './rvx-player.style';
import { template } from './rvx-player.template';
const shaka = require('shaka-player/dist/shaka-player.ui.js');
/**
 * Player web component
 * @public
 */
@customElement({
    name: 'rvx-player',
    template,
    styles
})
export class PlayerComponent extends FASTElement {
    /**
     * The width of the item.
     *
     * @public
     * @remarks
     * HTML attribute: text
     */
    @attr public width: string = '100%';
    @attr public height: string = '100%';

    private video!: HTMLVideoElement;
    private videoContainer!: HTMLElement;
    public constructor() {
        super();
    }

    public connectedCallback() {
        super.connectedCallback();

        this.video = this.shadowRoot?.querySelector('#player-video') as HTMLVideoElement;
        this.videoContainer = this.shadowRoot?.querySelector('.video-container') as HTMLElement;

        if (!this.video) {
            return;
        }
        // Init Shaka player
        this.initPlayer();
    }

    private initPlayer() {
        shaka.polyfill.installAll();
        // Getting reference to video and video container on DOM
        // Initialize shaka player
        const player = new shaka.Player(this.video);

        const uiConfig = {
            controlPanelElements: ['mute', 'volume', 'time_and_duration', 'fullscreen', 'overflow_menu']
        };

        // Setting up shaka player UI
        const ui = new shaka.ui.Overlay(player, this.videoContainer, this.video);
        ui.configure(uiConfig);
        ui.getControls();

        console.log(Object.keys(shaka.ui));

        // Listen for error events.
        player.addEventListener('error', this.onErrorEvent);

        // Try to load a manifest.
        // This is an asynchronous process.
        const manifestUri = 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
        player
            .load(manifestUri)
            .then(function () {
                // This runs if the asynchronous load is successful.
                // eslint-disable-next-line no-console
                console.log('The video has now been loaded!');
            })
            .catch(this.onError); // onError is executed if the asynchronous load fails.
    }

    private onErrorEvent(event: any) {
        // Extract the shaka.util.Error object from the event.
        this.onError(event.detail);
    }

    private onError(error: any) {
        // Log the error.
        // eslint-disable-next-line no-console
        console.error('Error code', error.code, 'object', error);
    }
}
