import { ISeekBar } from './svg-progress-chart/svg-progress.definitions';

export interface IUISegment {
    startSeconds: number;
    endSeconds: number;
    color?: string;
    textColor?: string;
}

export interface IDisplayOptions {
    height: number;
    barHeight?: number;
    tooltipHeight?: number;
    top?: number;
    renderTooltip?: boolean;
    renderProgress?: boolean;
    renderSeek?: ISeekBar;
    timeSmoothing?: number;
    zoom?: number;
    zoomFactor?: number;
    disableCursor?: boolean; // Disable cursor on un segment parts
}

export interface ISegmentsTimelineData {
    segments: IUISegment[];
    duration: number;
}

export interface ISegmentsTimelineConfig {
    data: ISegmentsTimelineData;
    displayOptions: IDisplayOptions;
}

export interface IUISegmentEventData {
    segment: IUISegment;
    time: number;
}

export enum SegmentsTimelineEvents {
    CURRENT_TIME_CHANGE = 'SEGMENTS_TIMELINE_CURRENT_TIME_CHANGED',
    SEGMENT_CLICKED = 'SEGMENTS_TIMELINE_SEGMENT_CLICKED',
    SEGMENT_START = 'SEGMENTS_TIMELINE_SEGMENT_START'
}
