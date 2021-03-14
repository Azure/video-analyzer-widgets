import { html } from '@microsoft/fast-element';
import { PlayerComponent } from '.';

/**
 * The template for the example component.
 * @public
 */
export const template = html<PlayerComponent>`
    <template>
        <div class="video-container">
            <video id="player-video" width="${(x) => x.width}" height="${(x) => x.height}"></video>
        </div>
    </template>
`;
