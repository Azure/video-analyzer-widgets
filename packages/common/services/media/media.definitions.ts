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
