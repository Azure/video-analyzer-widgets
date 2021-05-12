import { html, when } from '@microsoft/fast-element';
import { ZoneDrawerWidget } from './zone-drawer.widget';
import { POLYGON_SVG_PATH, LINE_SVG_PATH } from '../../../styles/svg/svg.shapes';

/**
 * The template for the zone drawer widget
 * @public
 */
/* eslint-disable  @typescript-eslint/indent */
/* eslint-disable  @typescript-eslint/no-shadow */
export const template = html<ZoneDrawerWidget>`
    <template>
        <div class="zone-drawer-wrapper">
            <div class="draw-options-container">
                <div class="draw-buttons">
                    <fast-button
                        class=${(x) => (!x.isLineDrawMode ? 'selected' : '')}
                        aria-label="Polygon"
                        title="Polygon"
                        @click="${(x) => x.toggleDrawerMode()}"
                    >
                        <svg>
                            <path d="${POLYGON_SVG_PATH}"></path>
                        </svg>
                    </fast-button>
                    <fast-button
                        class=${(x) => (x.isLineDrawMode ? 'selected' : '')}
                        aria-label="Line"
                        title="Line"
                        @click="${(x) => x.toggleDrawerMode()}"
                    >
                        <svg>
                            <path d="${LINE_SVG_PATH}"></path>
                        </svg>
                    </fast-button>
                </div>
                <span>Draw a ${(x) => (x.isLineDrawMode ? 'line' : 'polygon')}</span>
            </div>
            <div class="zones-container">
                <div class="zones-draw-container">
                    <div class="draw-zone-container">
                        <div class="draw-zone">
                            <media-zones-view></media-zones-view>
                            ${when(
                                (x) => x.showDrawer && x.isReady,
                                html`
                                    ${(x) => {
                                        if (x.isLineDrawMode) {
                                            return html`<media-line-drawer
                                                connectedCallback="${(x) => x.drawerConnectedCallback()}"
                                            ></media-line-drawer>`;
                                        } else {
                                            return html`<media-polygon-drawer
                                                connectedCallback="${(x) => x.drawerConnectedCallback()}"
                                            ></media-polygon-drawer>`;
                                        }
                                    }}
                                `
                            )}
                        </div>
                    </div>
                    <div class="rvx-widget-container">
                        <!-- rvx widget -->
                        <slot name="player"></slot>
                    </div>
                </div>
                <div class="zones-list-container">
                    <ul class="labels-list"></ul>
                    ${when(
                        (x) => x.isLabelsListEmpty,
                        html`<span>Draw polygons or lines around the zone of interest in the frame.</span> `
                    )}
                </div>
            </div>
            <div class="action-buttons">
                <fast-button
                    ?disabled="${(x) => !x.isDirty}"
                    appearance="accent"
                    aria-label="Save"
                    title="Save"
                    @click="${(x) => x.save()}"
                >
                    Save
                </fast-button>
            </div>
        </div>
    </template>
`;
