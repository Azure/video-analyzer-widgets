import { IUISegment } from '../segments-timeline/segments-timeline.definitions';

export interface ITimeLineConfig {
    segments: IUISegment[];
    date: Date;
    enableZoom?: boolean;
}

export enum TimelineEvents {
    JUMP_TO_NEXT_SEGMENT = 'TIMELINE_JUMP_TO_NEXT_SEGMENT',
    JUMP_TO_PREVIOUS_SEGMENT = 'TIMELINE_JUMP_TO_PREVIOUS_SEGMENT',
    SEGMENT_CHANGE = 'TIMELINE_SEGMENT_CHANGE'
}
