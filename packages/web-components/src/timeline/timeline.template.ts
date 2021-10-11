import { html, when } from '@microsoft/fast-element';
import { TimelineComponent } from '.';
import {
    ZOOM_MARKER_BG_PATH,
    ZOOM_MARKER_PATH,
    ZOOM_MINUS_PATH,
    ZOOM_PLUS_PATH_1,
    ZOOM_PLUS_PATH_2,
    ZOOM_REST_PATH
} from '../../../styles/svg/svg.shapes';

/**
 * The template for the Time Line component.
 * @public
 */
/* eslint-disable  @typescript-eslint/indent */
export const template = html<TimelineComponent>`
    <template>
        <div
            class="scroll-container
        ${(x) => (x.config?.disableZoom ? 'disable-zoom' : 'zoom')}"
        >
            <div class="scroll-width">
                <media-segments-timeline
                    connectedCallback="${(x) => x.segmentsTimelineConnectedCallback()}"
                    id="media-segments-timeline-${(x) => x.id}"
                ></media-segments-timeline>
                <media-time-ruler
                    connectedCallback="${(x) => x.timeRulerConnectedCallback()}"
                    id="media-time-ruler-${(x) => x.id}"
                ></media-time-ruler>
            </div>
        </div>
        ${when(
            (x) => !x.config?.disableZoom,
            html`
                <div class="zoom-controls-container">
                    <fast-button
                        class="left-button"
                        aria-label="${(x) => x.resources?.TIMELINE_ZoomOut}"
                        title="${(x) => x.resources?.TIMELINE_ZoomOut}"
                        @keyup="${(x, c) => x.handleZoomOutKeyUp(c.event as KeyboardEvent)}"
                        @mouseup="${(x, c) => x.handleZoomOutMouseUp(c.event as MouseEvent)}"
                    >
                        <svg class="minus-svg">
                            <path d="${ZOOM_MINUS_PATH}"></path>
                        </svg>
                    </fast-button>
                    <fast-slider class="zoom-slider" connectedCallback="${(x) => x.fastSliderConnectedCallback()}">
                        <svg class="fast-slider-svg" slot="thumb">
                            <path class="marker-bg-path" d="${ZOOM_MARKER_BG_PATH}"></path>
                            <path class="marker-path" d="${ZOOM_MARKER_PATH}"></path>
                        </svg>
                    </fast-slider>
                    <fast-button
                        class="right-button"
                        aria-label="${(x) => x.resources?.TIMELINE_ZoomIn}"
                        title="${(x) => x.resources?.TIMELINE_ZoomIn}"
                        @keyup="${(x, c) => x.handleZoomInKeyUp(c.event as KeyboardEvent)}"
                        @mouseup="${(x, c) => x.handleZoomInMouseUp(c.event as MouseEvent)}"
                    >
                        <svg class="plus-svg">
                            <path d="${ZOOM_PLUS_PATH_1}"></path>
                            <path d="${ZOOM_PLUS_PATH_2}"></path>
                        </svg>
                    </fast-button>
                    <fast-button
                        class="reset-button"
                        aria-label="${(x) => x.resources?.TIMELINE_ZoomReset}"
                        title="${(x) => x.resources?.TIMELINE_ZoomReset}"
                        @keyup="${(x, c) => x.handleZoomResetKeyUp(c.event as KeyboardEvent)}"
                        @mouseup="${(x, c) => x.handleZoomResetMouseUp(c.event as MouseEvent)}"
                    >
                        <svg class="reset-svg">
                            <path d="${ZOOM_REST_PATH}"></path>
                        </svg>
                    </fast-button>
                </div>
            `
        )}
    </template>
`;
