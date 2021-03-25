import { IUISegment } from '../segments-timeline/segments-timeline.definitions';

export interface ITimeLineConfig {
    segments: IUISegment[];
    date: Date;
    enableZoom?: boolean;
}
