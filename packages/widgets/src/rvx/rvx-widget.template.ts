import { html } from '@microsoft/fast-element';
import { RVXWidget } from '.';

/**
 * The template for the example component.
 * @public
 */
export const template = html<RVXWidget>`
    <template>
        <ava-design-system-provider
            style="${(x) => (x.width ? 'width: ' + x.width + ';' : '')}
                   ${(x) => (x.height ? 'height:' + x.height + ';' : '')}"
            theme="dark"
            use-defaults
        >
            <rvx-player cameraName="${(x) => x.widgetConfig?.videoName}"> </rvx-player>
        </ava-design-system-provider>
    </template>
`;
