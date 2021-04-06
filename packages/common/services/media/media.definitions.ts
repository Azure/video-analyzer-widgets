export enum VideoFormat {
    DASH = 'dash',
    HLS = 'hls'
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
