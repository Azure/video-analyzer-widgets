import { html } from '@microsoft/fast-element';
import { PlayerComponent } from '.';

/**
 * The template for the example component.
 * @public
 */
export const template = html<PlayerComponent>`
    <template>
        <div class="upper-bounding">
            <span class="col camera-name">${(x) => x.cameraName}</span>
            <div class="date-picker col">
                <span class="time-container">${(x) => x.time}</span>
                <media-date-picker
                    class="date-picker-component"
                    alignRight="${true}"
                    inputDate="${(x) => x.currentDate.toUTCString()}"
                ></media-date-picker>
            </div>
        </div>
        <span class="error">theres seems to be a problem. Please try again later</span>
        <div
            shaka-controls="true"
            class="video-container 
            ${(x) => (x.isLive ? 'live' : 'vod')}"
        >
            <video id="player-video"></video>
        </div>
    </template>
`;
