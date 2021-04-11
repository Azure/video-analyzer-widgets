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
        ${when(
            (x) => x.config?.mode === LayerLabelMode.Compact,
            html` <span class="label" aria-label="${(x) => x.config.label}" title="${(x) => x.config.label}"
                >${(x) => x.config.label}</span
            >`
        )}
        ${when(
            (x) => x.config?.mode === LayerLabelMode.Actions,
            html` <div class="color-container" style="background: ${(x) => x.config?.color};"></div>
                <span class="label-prefix" aria-label="${(x) => x.config.label}" title="${(x) => x.config.label}"
                    >${(x) => `${x.config?.label}`}</span
                >
                <media-actions-menu></media-actions-menu>`
        )}
        ${when(
            (x) => x.config?.mode === LayerLabelMode.Expanded,
            html` <div class="color-container" style="background: ${(x) => x.config?.color};"></div>
                <span
                    class="label-prefix"
                    aria-label="${(x) => `${x.config?.labelPrefix} - ${x.config?.label}`}"
                    title="${(x) => `${x.config?.labelPrefix} - ${x.config?.label}`}"
                    >${(x) => `${x.config?.labelPrefix} -`} <span class="label">${(x) => `${x.config?.label}`}</span></span
                >`
        )}
    </template>
`;
