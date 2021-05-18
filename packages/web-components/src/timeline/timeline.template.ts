import { html } from '@microsoft/fast-element';
import { TimelineComponent } from '.';

/**
 * The template for the Time Line component.
 * @public
 */
export const template = html<TimelineComponent>`
    <template>
        <media-segments-timeline
            connectedCallback="${(x) => x.segmentsTimelineConnectedCallback()}"
            id="media-segments-timeline-${(x) => x.id}"
        ></media-segments-timeline>
        <media-time-ruler
            connectedCallback="${(x) => x.timeRulerConnectedCallback()}"
            id="media-time-ruler-${(x) => x.id}"
        ></media-time-ruler>
    </template>
`;
