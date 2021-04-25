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
            range_query = `,starttime=${range.start.toISOString()},endtime=${range.end.toISOString()}`;
        }

        return `${this.baseStream}/manifest(format=${format}${range_query})${extension}`;
    }

    public static getAvailableMedia(precision: Precision, range: ITimeRange = null): Promise<Response> {
        // time ranges are required for month, day and full
        if ((precision === Precision.MONTH || precision === Precision.DAY || precision === Precision.FULL) && !range) {
            throw Error('wrong parameters');
        }

        const range_query = `?precision=${precision}${
            range ? `&starttime=${this.extractDate(range.start, precision)}&endtime=${this.extractDate(range.end, precision)}` : ''
        }`;
        const url = `${this.baseStream}/availableMedia${range_query}`;

        return fetch(url, {
            // credentials: 'include'
        }); // (fetch(url) as unknown) as Promise<IAvailableMediaResponse>;
    }

    private static extractDate(date: Date, precision: Precision) {
        const value = date.toISOString();

        if (precision === Precision.YEAR) {
            return value.substring(0, 4);
        } else if (precision === Precision.MONTH) {
            return value.substring(0, 7);
        } else if (precision === Precision.DAY) {
            return value.substring(0, 10);
        } else {
            return value;
        }
    }
}
