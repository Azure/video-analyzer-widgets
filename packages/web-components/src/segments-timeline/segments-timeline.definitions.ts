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
    timeSmoothing?: number;
    zoom?: number;
}

export interface ISegmentsTimelineData {
    segments: IUISegment[];
    duration: number;
}

export interface ISegmentsTimelineConfig {
    data: ISegmentsTimelineData;
    displayOptions: IDisplayOptions;
}

export enum SegmentsTimelineEvents {
    CurrentTimeChanged = 'SEGMENTS_TIMELINE_CURRENT_TIME_CHANGED',
    SegmentClicked = 'SEGMENTS_TIMELINE_SEGMENT_CLICKED'
}
