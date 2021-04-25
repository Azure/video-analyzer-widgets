import { IUISegment } from '../segments-timeline/segments-timeline.definitions';

export interface ITimeLineConfig {
    segments: IUISegment[];
    date: Date;
    enableZoom?: boolean;
}

export enum TimelineEvents {
    SEGMENT_CHANGE = 'TIMELINE_SEGMENT_CHANGE'
}
