import { html } from '@microsoft/fast-element';
import { Player } from './player-widget';

/**
 * The template for the example component.
 * @public
 */
export const template = html<Player>`
    <template>
        <player-component
            cameraName="${(x) => x.config?.videoName}"
            style="${(x) => (x.width ? 'width: ' + x.width + ';' : '')}"
        ></player-component>
    </template>
`;
