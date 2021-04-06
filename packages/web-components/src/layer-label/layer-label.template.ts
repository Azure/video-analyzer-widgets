import { html, when } from '@microsoft/fast-element';
import { LayerLabelComponent } from './layer-label.component';
import { LayerLabelMode } from './layer-label.definitions';

/**
 * The template for the layer label component.
 * @public
 */
/* eslint-disable  @typescript-eslint/indent */
export const template = html<LayerLabelComponent>`
    <template class="${(x) => x.config?.mode}">
        ${when((x) => x.config?.mode === LayerLabelMode.Compact, html` <span class="label">${(x) => `${x.config?.label}`}</span>`)}
        ${when(
            (x) => x.config?.mode === LayerLabelMode.Actions,
            html` <div class="color-container ${(x) => x.config?.color}"></div>
                <span class="label-prefix">${(x) => `${x.config?.labelPrefix}`}</span>
                <media-actions-menu></media-actions-menu>`
        )}
        ${when(
            (x) => x.config?.mode === LayerLabelMode.Expanded,
            html` <div class="color-container ${(x) => x.config?.color}"></div>
                <span class="label-prefix">${(x) => `${x.config?.labelPrefix} -`}</span>
                <span class="label">${(x) => `${x.config?.label}`}</span>`
        )}
    </template>
`;
