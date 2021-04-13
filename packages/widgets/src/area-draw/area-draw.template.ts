import { html, repeat, when } from '@microsoft/fast-element';
import { AreaDrawWidget } from './area-draw.widget';
import { CLOSE_BIG_SVG_PATH, LINE_SVG_PATH, MORE_SVG_PATH, POLYGON_SVG_PATH } from '../../../styles/svg/svg-shapes';
import { AreaDrawMode } from './area-draw.definitions';

/**
 * The template for the actions menu component.
 * @public
 */
/* eslint-disable  @typescript-eslint/indent */
export const template = html<AreaDrawWidget>`
    <template>
        <div class="widget-header">
            <span>Area of interest</span>
            <fast-button aria-label="Close" title="Close" @click="${(x) => x.close()}">
                <svg>
                    <path d="${CLOSE_BIG_SVG_PATH}"></path>
                </svg>
            </fast-button>
        </div>
        <div class="draw-options-container">
            <div class="draw-buttons">
                <fast-button
                    class=${(x) => (!x.isLineDrawMode ? 'selected' : '')}
                    aria-label="Polygon"
                    title="Polygon"
                    @click="${(x) => x.toggleDrawMode()}"
                >
                    <svg>
                        <path d="${POLYGON_SVG_PATH}"></path>
                    </svg>
                </fast-button>
                <fast-button
                    class=${(x) => (x.isLineDrawMode ? 'selected' : '')}
                    aria-label="Line"
                    title="Line"
                    @click="${(x) => x.toggleDrawMode()}"
                >
                    <svg>
                        <path d="${LINE_SVG_PATH}"></path>
                    </svg>
                </fast-button>
            </div>
            <span>Draw a ${(x) => (x.isLineDrawMode ? 'line' : 'polygon')}</span>
        </div>
        <div class="areas-container">
            <div class="areas-draw-container">
                <div class="draw-area-container">
                    <div class="draw-area">
                        <media-areas-view></media-areas-view>
                        ${when(
                            (x) => x.showDrawer && x.isReady,
                            html`
                                ${(x) => {
                                    if (x.isLineDrawMode) {
                                        return html`<media-line-drawer
                                            connectedCallback="${(x) => x.lineDrawerConnectedCallback()}"
                                        ></media-line-drawer>`;
                                    } else {
                                        return html`<media-polygon-drawer></media-polygon-drawer>`;
                                    }
                                }}
                            `
                        )}
                    </div>
                </div>
                <div class="rvx-widget-container">
                    <!-- rvx widget -->
                    <img src="assets/video-demo.png" width="100%" />
                </div>
            </div>
            <div class="areas-list-container">
                <ul class="labels-list"></ul>
                ${when((x) => x.isLabelsListEmpty, html`<span>Draw polygons or lines around the area of interest in the frame.</span> `)}
            </div>
        </div>
        <div class="action-buttons">
            <fast-button ?disabled="${(x) => !x.isDirty}" aria-label="Save" title="Save" @click="${(x) => x.save()}">
                Save
            </fast-button>
            <fast-button aria-label="Done" title="Done" @click="${(x) => x.done()}">
                Done
            </fast-button>
        </div>
    </template>
`;
