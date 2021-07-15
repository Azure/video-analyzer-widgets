import { IExpandedTimeRange, IExpandedDate, Precision, VideoFormat } from './media.definitions';

export class MediaApi {
    private static _baseStream = '';
    private static _format = VideoFormat.DASH;

    public static set format(value: VideoFormat) {
        MediaApi._format = value;
    }

    public static get baseStream() {
        return MediaApi._baseStream;
    }

    public static set baseStream(value) {
        MediaApi._baseStream = value;
    }

    public static getLiveStream(): string {
        const format = MediaApi._format === VideoFormat.HLS ? 'm3u8-cmaf' : 'mpd-time-cmaf';
        const extension = MediaApi._format === VideoFormat.HLS ? '.m3u8' : '.mpd';

        return `${this.baseStream}/manifest(format=${format})${extension}`;
    }

    public static getVODStream(range: IExpandedTimeRange = null): string {
        const format = MediaApi._format === VideoFormat.HLS ? 'm3u8-cmaf' : 'mpd-time-cmaf';
        const extension = MediaApi._format === VideoFormat.HLS ? '.m3u8' : '.mpd';

        let range_query = '';
        if (range) {
            const startDay = this.convertDateToIso(range.start.year, range.start.month, range.start.day);
            const endDay = this.convertDateToIso(range.end.year, range.end.month, range.end.day);
            range_query = `,starttime=${startDay},endtime=${endDay}`;
        }

        return `${this.baseStream}/manifest(format=${format}${range_query})${extension}`;
    }

    public static getVODStreamForCLip(startTime: Date, endTime: Date): string {
        const format = MediaApi._format === VideoFormat.HLS ? 'm3u8-cmaf' : 'mpd-time-cmaf';
        const extension = MediaApi._format === VideoFormat.HLS ? '.m3u8' : '.mpd';

        let range_query = '';
        const startTimeISOFormat = startTime && startTime.toISOString();
        const endTimeISOFormat = endTime && endTime.toISOString();
        if (startTimeISOFormat && endTimeISOFormat) {
            range_query = `,starttime=${startTimeISOFormat},endtime=${endTimeISOFormat}`;
        }

        return `${this.baseStream}/manifest(format=${format}${range_query})${extension}`;
    }

    public static getAvailableMedia(
        precision: Precision,
        range: IExpandedTimeRange = null,
        allowCrossSiteCredentials = true,
        token?: string
    ): Promise<Response> {
        // time ranges are required for month, day and full
        if ((precision === Precision.MONTH || precision === Precision.DAY || precision === Precision.FULL) && !range) {
            throw Error('wrong parameters');
        }

        const range_query = `?precision=${precision}${
            range ? `&starttime=${this.extractDate(range.start, precision)}&endtime=${this.extractDate(range.end, precision)}` : ''
        }`;
        const url = `${this.baseStream}/availableMedia${range_query}`;

        // eslint-disable-next-line no-undef
        const requestInit: RequestInit = {};

        if (allowCrossSiteCredentials) {
            requestInit.credentials = 'include';
        }

        if (token) {
            requestInit.headers = {
                Authorization: `Bearer ${token}`
            };
        }
        return fetch(url, requestInit);
    }

    private static convertDateToIso(year: number, month: number, day: number) {
        return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
    }

    private static extractDate(date: IExpandedDate, precision: Precision) {
        if (precision === Precision.MONTH) {
            return `${date.year}-${date.month > 9 ? date.month : '0' + date.month}`;
        } else if (precision === Precision.DAY || precision === Precision.FULL) {
            return this.convertDateToIso(date.year, date.month, date.day);
        } else {
            return '';
        }
    }
}
