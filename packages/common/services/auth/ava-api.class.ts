import { WidgetGeneralError } from '../../../widgets/src';
import { MediaApi } from '../media/media-api.class';
import { VideoContentToken } from '../media/media.definitions';
import { TokenHandler } from './token-handler.class';

export class AvaAPi {
    private static _videoName = '';
    private static readonly apiVersion = '2021-11-01-preview';

    private static cookieTimeoutRef = 0;
    private static cookieExpiration: Date;
    private static _fallbackAPIBase = '';
    private static _clientApiEndpointUrl = '';
    private static readonly MAX_SET_TIMEOUT_TIME = 2147483647;

    public static get apiBase() {
        return this._fallbackAPIBase || this._clientApiEndpointUrl;
    }

    public static async authorize() {
        // If there is an existing cookie handler, clear it
        if (this.cookieTimeoutRef !== 0) {
            // Clear existing interval
            window.clearTimeout(this.cookieTimeoutRef);
            this.cookieTimeoutRef = 0;
        }

        const url = `${this.apiBase}/videos/${this.videoName}/listContentToken?api-version=${this.apiVersion}`;

        const headers = { 'Content-Type': 'application/json' };
        headers['Authorization'] = `Bearer ${TokenHandler.avaAPIToken}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TokenHandler.avaAPIToken}`
            }
        });
        const data: VideoContentToken = await response.json();
        MediaApi.contentToken = data.Token;
        if (!data.ExpirationDate) {
            throw new WidgetGeneralError('Invalid cookie expiration');
        }
        this.cookieExpiration = new Date(data.ExpirationDate);
        const cookieExpirationTime = this.cookieExpiration.getTime() - new Date(Date.now()).getTime();
        if (cookieExpirationTime < AvaAPi.MAX_SET_TIMEOUT_TIME) {
            this.cookieTimeoutRef = window.setTimeout(this.cookieExpiredHandler.bind(this), cookieExpirationTime);
        }
    }

    public static getVideo(videoName?: string): Promise<Response> {
        if (videoName) {
            this.videoName = videoName;
        }

        const url = `${this.apiBase}/videos/${this.videoName}?api-version=${this.apiVersion}`;

        const headers = { 'Content-Type': 'application/json' };
        headers['Authorization'] = `Bearer ${TokenHandler.avaAPIToken}`;

        return fetch(url, { headers });
    }

    public static get fallbackAPIBase() {
        return AvaAPi._fallbackAPIBase;
    }

    public static set fallbackAPIBase(value) {
        AvaAPi._fallbackAPIBase = value;
    }

    public static get videoName() {
        return AvaAPi._videoName;
    }

    public static set videoName(value) {
        AvaAPi._videoName = value;
    }

    public static get clientApiEndpointUrl() {
        return AvaAPi._clientApiEndpointUrl;
    }

    public static set clientApiEndpointUrl(value) {
        AvaAPi._clientApiEndpointUrl = value;
    }

    private static cookieExpiredHandler() {
        // Clear timeout
        window.clearTimeout(this.cookieTimeoutRef);
        this.cookieTimeoutRef = 0;

        // Authorize
        this.authorize();
    }
}
