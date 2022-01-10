/* eslint-disable @typescript-eslint/naming-convention */
export enum VideoFormat {
    DASH = 'dash',
    HLS = 'hls'
}

export interface IExpandedDate {
    year: number;
    month: number;
    day: number;
}

export interface IExpandedTimeRange {
    start: IExpandedDate;
    end?: IExpandedDate;
}

export interface ITimeRange {
    start: Date;
    end: Date;
}

export enum Precision {
    FULL = 'full',
    DAY = 'day',
    MONTH = 'month',
    YEAR = 'year'
}

export interface IAvailableMediaRange {
    start: string;
    end: string;
}

export interface IAvailableMediaResponse {
    timeRanges: IAvailableMediaRange[];
}

export interface VideoEntity {
    readonly id?: string;
    readonly name?: string;
    readonly type?: string;
    readonly systemData?: SystemData;
    properties?: VideoProperties;
}

export interface VideoProperties {
    title?: string;
    description?: string;
    readonly type?: string;
    readonly flags?: VideoFlags;
    readonly contentUrls?: VideoContentUrls;
    archival?: VideoArchival;
}

export interface VideoContentUrls {
    downloadUrl?: string;
    archiveBaseUrl?: string;
    rtspTunnelUrl?: string;
    previewImageUrls?: VideoPreviewImageUrls;
}

export interface VideoFlags {
    canStream: boolean;
    hasData: boolean;
    isInUse: boolean;
}

export interface VideoArchival {
    retentionPeriod?: string;
}

export interface VideoPreviewImageUrls {
    small?: string;
    medium?: string;
    large?: string;
}

export interface SystemData {
    createdBy?: string;
    createdByType?: string;
    createdAt?: Date;
    lastModifiedBy?: string;
    lastModifiedByType?: string;
    lastModifiedAt?: Date;
}

export interface VideoContentToken {
    readonly ExpirationDate?: Date;
    readonly Token?: string;
}
