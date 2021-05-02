import EventEmitter from 'node:events';
import jwt_decode, { JwtPayload } from 'jwt-decode';

export class TokenHandler {
    public static tokenExpiredEvent: EventEmitter;
    private static _avaAPIToken = '';

    private static tokenTimeoutRef = 0;
    private static _tokenExpiredCallback: () => void;

    private static readonly MAX_SET_TIMEOUT_TIME = 2147483647;

    public static get avaAPIToken() {
        return TokenHandler._avaAPIToken;
    }

    public static set avaAPIToken(value) {
        TokenHandler._avaAPIToken = value;
        this.init();
    }

    public static get tokenExpiredCallback(): () => void {
        return TokenHandler._tokenExpiredCallback;
    }
    public static set tokenExpiredCallback(value: () => void) {
        TokenHandler._tokenExpiredCallback = value;
    }

    private static tokenExpiredHandler() {
        // If expired, emit an event
        if (this.tokenExpiredCallback) {
            this.tokenExpiredCallback();
        }

        // Clear interval
        window.clearTimeout(this.tokenTimeoutRef);
        this.tokenTimeoutRef = 0;
    }

    private static init() {
        if (this.tokenTimeoutRef !== 0) {
            // Clear existing interval
            window.clearTimeout(this.tokenTimeoutRef);
            this.tokenExpiredHandler();
        }

        let tokenExpirationTime;
        const decoded = jwt_decode(this.avaAPIToken) as JwtPayload;
        if (decoded.exp === undefined) {
            tokenExpirationTime = 0;
            this.tokenExpiredHandler();
            return;
        }

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp - 5);
        tokenExpirationTime = date.getTime() - new Date(Date.now()).getTime();
        if (tokenExpirationTime < TokenHandler.MAX_SET_TIMEOUT_TIME) {
            this.tokenTimeoutRef = window.setTimeout(this.tokenExpiredHandler.bind(this), tokenExpirationTime);
        }
    }
}
