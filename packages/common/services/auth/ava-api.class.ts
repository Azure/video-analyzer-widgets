import { TokenHandler } from './token-handler.class';

export class AvaAPi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static cookie: any;
    private static _accountID = '';
    private static _longRegionCode = '';
    private static _videoName = '';
    private static isTestEnv = true;
    private static readonly apiVersion = '2021-05-01-preview';

    private static cookieIntervalChecker = 0;
    private static cookieExpiration: Date;

    public static get apiBase() {
        // return `https://${this.accountID}.api.${this.longRegionCode}.videoanalyzer.azure${this.isTestEnv ? '-test' : ''}.net`;
        return 'http://localhost:4100/mocks/ava/';
    }

    public static async authorize() {
        // If there is an existing cookie handler, clear it
        if (this.cookieIntervalChecker !== 0) {
            // Clear existing interval
            window.clearInterval(this.cookieIntervalChecker);
            this.cookieIntervalChecker = 0;
        }

        const url = `${this.apiBase}/videos/${this.videoName}/playbackAuthorization?api-version=${this.apiVersion}`;

        const headers = { 'Content-Type': 'application/json' };
        headers['Authorization'] = `Bearer ${TokenHandler.avaAPIToken}`;

        const response = await fetch(url, { headers });
        const data = await response.json();
        this.cookieExpiration = new Date(data.expiration);
        this.cookie = await response.headers.get('x-ava-token');
        console.log(this.cookieExpiration);
        this.cookieIntervalChecker = window.setInterval(this.cookieExpiredHandler.bind(this, 100));
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

    public static get videoName() {
        return AvaAPi._videoName;
    }

    public static set videoName(value) {
        console.log('videoName id set', value);
        AvaAPi._videoName = value;
    }

    public static get longRegionCode() {
        return AvaAPi._longRegionCode;
    }

    public static set longRegionCode(value) {
        console.log('longRegionCode id set', value);
        AvaAPi._longRegionCode = value;
    }

    public static get accountID() {
        return AvaAPi._accountID;
    }

    public static set accountID(value) {
        console.log('account id set', value);
        AvaAPi._accountID = value;
    }

    private static cookieExpiredHandler() {
        // First, check if cookie expired
        if (new Date().valueOf() >= this.cookieExpiration?.valueOf() || false) {
            // Authorize
            this.authorize();
        }
    }
}
