import { html } from '@microsoft/fast-element';
import { Player } from './rvx-widget';

/**
 * The template for the example component.
 * @public
 */
export const template = html<Player>`
    <template>
        <rvx-player
            cameraName="${(x) => x.config?.videoName}"
            style="${(x) => (x.width ? 'width: ' + x.width + ';' : '')}"
        ></rvx-player>
    </template>
`;
