import { IUISegment } from '../segments-timeline/segments-timeline.definitions';

export interface IMetadataTimelinesConfig {
    data: IMetadataSegmentsConfig[];
    duration: number;
    date: Date;
    disableZoom?: boolean;
}

export interface IMetadataSegmentsConfig {
    tag: string;
    segments: IUISegment[];
}

export interface IAvailableMetadataResponse {
    value: TimedMetadataSegment[];
}

export interface TimedMetadataSegment {
    id: string;
    videoName: string;
    startTime: string;
    endTime: string;
    count: number;
    metadata: TimedMetadataSegmentMetadata;
}

export interface TimedMetadataSegmentStats {
    count: number;
    countPartition: number;
}

export interface TimedMetadataSegmentMetadata {
    type: string;
    subType: string;
    entity: TimedMetadataSegmentEntity;
}

export interface TimedMetadataSegmentEntity {
    tag: TimedMetadataSegmentTag;
}

export interface TimedMetadataSegmentTag {
    value: string;
}

export interface IMetadataSegments {
    [key: string]: IUISegment[]
}