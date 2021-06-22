import { html } from '@microsoft/fast-element';
import { Player } from './player-widget';

/**
 * The template for the example component.
 * @public
 */
export const template = html<Player>`
    <template>
        <media-player
            cameraName="${(x) => x.config?.videoName}"
            style="${(x) => (x.width ? 'width: ' + x.width + ';' : '')}"
        ></media-player>
    </template>
`;
