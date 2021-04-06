import { html } from '@microsoft/fast-element';
import { PlayerComponent } from '.';

/**
 * The template for the example component.
 * @public
 */
export const template = html<PlayerComponent>`
    <template>
        <div class="upper-bounding">
            <span class="col camera-name">Camera 1</span>
            <div class="date-picker col">
                <span>${(x) => x.time}</span>
                <date-picker-component
                    class="date-picker-component"
                    inputDate="${(x) => x.currentDate}"
                    allowedDays="${(x) => x.currentAllowedDays}"
                    allowedMonths="${(x) => x.currentAllowedMonths}"
                    allowedYears="${(x) => x.currentAllowedYears}"
                ></date-picker-component>
            </div>
        </div>
        <style>
            @import '../controls.css';
        </style>
        <div shaka-controls="true" class="video-container ${(x) => (x.isLive ? 'live' : 'vod')}">
            <video id="player-video" width="${(x) => x.width}" height="${(x) => x.height}"></video>
        </div>
    </template>
`;
