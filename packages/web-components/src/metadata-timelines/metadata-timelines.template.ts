import { html, repeat, when } from '@microsoft/fast-element';
import { MetadataTimelines } from './metadata-timelines.component';
import { ZOOM_MARKER_BG_PATH, ZOOM_MARKER_PATH, ZOOM_MINUS_PATH, ZOOM_PLUS_PATH_1, ZOOM_PLUS_PATH_2 } from '../../../styles/svg/svg.shapes';

export const template = html<MetadataTimelines>`
    <template>
    <div class="metadata-panel-container">
        <div class="metadata-label-container">
            ${repeat(x => x.config?.data, html`
                <div>${i => i.tag}</div>`
            )}
        </div>
        <div 
            class="metadata-scroll-container ${(x) => (x.config?.disableZoom ? 'disable-zoom' : 'zoom')}"
        >
            <div class="scroll-width">
                ${repeat(x => x.config?.data, html`
                    <media-segments-timeline
                        id="media-segments-timeline-${(i, c) => c.parent.segmentsTimelineConnectedCallback()}"
                    ></media-segments-timeline>
                `, { positioning: true })}
                <media-time-ruler
                    connectedCallback="${(x) => x.timeRulerConnectedCallback()}"
                    id="media-time-ruler-${(x) => x.id}"
                ></media-time-ruler>
            </div>
        </div>
    </div>
    ${when(
        (x) => !x.config?.disableZoom,
        html`
            <div class="zoom-controls-container">
                <fast-button
                    class="left-button"
                    aria-label="${(x) => (x.resources?.TIMELINE_ZoomOut)}"
                    title="${(x) => (x.resources?.TIMELINE_ZoomOut)}"
                    @keyup="${(x, c) => x.handleZoomOutKeyUp(c.event as KeyboardEvent)}"
                    @mouseup="${(x, c) => x.handleZoomOutMouseUp(c.event as MouseEvent)}"
                >
                    <svg class="minus-svg">
                        <path d="${ZOOM_MINUS_PATH}"></path>
                    </svg>
                </fast-button>
                <fast-slider class="metadata-fast-slider" connectedCallback="${(x) => x.fastSliderConnectedCallback()}">
                    <svg class="fast-slider-svg" slot="thumb">
                        <path class="marker-bg-path" d="${ZOOM_MARKER_BG_PATH}"></path>
                        <path class="marker-path" d="${ZOOM_MARKER_PATH}"></path>
                    </svg>
                </fast-slider>
                <fast-button
                    class="right-button"
                    aria-label="${(x) => (x.resources?.TIMELINE_ZoomIn)}"
                    title="${(x) => (x.resources?.TIMELINE_ZoomIn)}"
                    @keyup="${(x, c) => x.handleZoomInKeyUp(c.event as KeyboardEvent)}"
                    @mouseup="${(x, c) => x.handleZoomInMouseUp(c.event as MouseEvent)}"
                >
                    <svg class="plus-svg">
                        <path d="${ZOOM_PLUS_PATH_1}"></path>
                        <path d="${ZOOM_PLUS_PATH_2}"></path>
                    </svg>
                </fast-button>
            </div>
        `
    )}
    </template>
`;