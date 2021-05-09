import { ITimeRange, Precision, VideoFormat } from './media.definitions';

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

    public static getVODStream(range: ITimeRange = null): string {
        const format = MediaApi._format === VideoFormat.HLS ? 'm3u8-cmaf' : 'mpd-time-cmaf';
        const extension = MediaApi._format === VideoFormat.HLS ? '.m3u8' : '.mpd';

        let range_query = '';
        if (range) {
            const startDay = this.convertDateToIso(
                range.start.getUTCFullYear(),
                range.start.getUTCMonth() + 1,
                range.start.getUTCDate() + 1
            );
            const endDay = this.convertDateToIso(range.end.getUTCFullYear(), range.end.getUTCMonth() + 1, range.end.getUTCDate() + 1);
            range_query = `,starttime=${startDay},endtime=${endDay}`;
            range_query = `,starttime=${this.extractDate(range.start, Precision.DAY)},endtime=${this.extractDate(
                range.end,
                Precision.DAY
            )}`;
        }

        return `${this.baseStream}/manifest(format=${format}${range_query})${extension}`;
    }

    public static getAvailableMedia(
        precision: Precision,
        range: ITimeRange = null,
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

    private static extractDate(date: Date, precision: Precision) {
        const currentUTCYear = date.getUTCFullYear();
        const currentUTCMonth = date.getUTCMonth() + 1;
        const currentUTCDate = date.getUTCDate();
        // const value = date.toISOString();

        if (precision === Precision.MONTH) {
            return `${currentUTCYear}-${currentUTCMonth > 9 ? currentUTCMonth : '0' + currentUTCMonth}`;
        } else if (precision === Precision.DAY) {
            return this.convertDateToIso(currentUTCYear, currentUTCMonth, currentUTCDate);
        } else {
            return '';
        }
    }

    private static convertDateToIso(year: number, month: number, day: number) {
        return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
    }
}
