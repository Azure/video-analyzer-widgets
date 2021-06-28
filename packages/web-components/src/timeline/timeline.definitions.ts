import { IUISegment } from '../segments-timeline/segments-timeline.definitions';

export interface ITimeLineConfig {
    segments: IUISegment[];
    date: Date;
    disableZoom?: boolean;
}

export enum TimelineEvents {
    CURRENT_TIME_CHANGE = 'TIMELINE_CURRENT_TIME_CHANGE',
    JUMP_TO_NEXT_SEGMENT = 'TIMELINE_JUMP_TO_NEXT_SEGMENT',
    JUMP_TO_PREVIOUS_SEGMENT = 'TIMELINE_JUMP_TO_PREVIOUS_SEGMENT',
    SEGMENT_CHANGE = 'TIMELINE_SEGMENT_CHANGE',
    SEGMENT_START = 'TIMELINE_SEGMENT_START'
}
