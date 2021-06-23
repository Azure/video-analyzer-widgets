import { html, when } from '@microsoft/fast-element';
import { ZoneDrawer } from './zone-drawer.widget';
import { POLYGON_SVG_PATH, LINE_SVG_PATH } from '../../../styles/svg/svg.shapes';

/**
 * The template for the zone drawer widget
 * @public
 */
/* eslint-disable  @typescript-eslint/indent */
/* eslint-disable  @typescript-eslint/no-shadow */
export const template = html<ZoneDrawer>`
    <template>
        <div class="zone-drawer-wrapper">
            <div class="draw-options-container">
                <div class="draw-buttons">
                    <fast-button
                        class=${(x) => (!x.isLineDrawMode ? 'selected' : '')}
                        aria-label="${(x) => x.resources?.ZONE_DRAWER_Polygon}"
                        title="${(x) => x.resources?.ZONE_DRAWER_Polygon}"
                        ?disabled="${(x) => x.disableDrawing}"
                        @click="${(x) => x.toggleDrawerMode()}"
                    >
                        <svg>
                            <path d="${POLYGON_SVG_PATH}"></path>
                        </svg>
                    </fast-button>
                    <fast-button
                        class=${(x) => (x.isLineDrawMode ? 'selected' : '')}
                        aria-label="${(x) => x.resources?.ZONE_DRAWER_Line}"
                        title="${(x) => x.resources?.ZONE_DRAWER_Line}"
                        ?disabled="${(x) => x.disableDrawing}"
                        @click="${(x) => x.toggleDrawerMode()}"
                    >
                        <svg>
                            <path d="${LINE_SVG_PATH}"></path>
                        </svg>
                    </fast-button>
                </div>
                <span>${(x) => (x.isLineDrawMode ? x.resources?.ZONE_DRAWER_Draw_a_line
        : x.resources?.ZONE_DRAWER_Draw_a_polygon)}</span>
            </div>
            <div class="zones-container">
                <div class="zones-draw-container">
                    <div class="draw-zone-container">
                        <div class="draw-zone">
                            <media-zones-view></media-zones-view>
                            ${when(
                                (x) => x.showDrawer && x.isReady && !x.disableDrawing,
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
                    <div class="player-widget-container">
                        <!-- player widget -->
                        <slot></slot>
                    </div>
                </div>
                <div class="zones-list-container">
                    <ul class="labels-list"></ul>
                    ${when(
                        (x) => x.isLabelsListEmpty,
                        html`<span>${(x) => x.resources?.ZONE_DRAWER_WidgetsInstructions}</span> `
                    )}
                    ${when((x) => x.disableDrawing, html`<span>${(x) => x.resources?.ZONE_DRAWER_IsDisabled}</span> `)}
                </div>
            </div>
            <div class="action-buttons">
                <fast-button
                    ?disabled="${(x) => !x.isDirty}"
                    appearance="accent"
                    aria-label="${(x) => x.resources?.ZONE_DRAWER_Save}"
                    title="${(x) => x.resources?.ZONE_DRAWER_Save}"
                    @click="${(x) => x.save()}"
                >
                   ${(x) => x.resources?.ZONE_DRAWER_Save}
                </fast-button>
            </div>
        </div>
    </template>
`;
