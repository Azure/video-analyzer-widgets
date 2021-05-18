import jwt_decode, { JwtPayload } from 'jwt-decode';
import { Logger } from '../../../widgets/src/common/logger';

export class TokenHandler {
    private static _avaAPIToken = '';

    private static tokenTimeoutRef = 0;
    private static _tokenExpiredCallback: () => void;

    private static readonly MAX_SET_TIMEOUT_TIME = 2147483647;

    private static readonly BUFFER_BEFORE_EXPIRED = 5;

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
        try {
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
            date.setUTCSeconds(decoded.exp - TokenHandler.BUFFER_BEFORE_EXPIRED);
            tokenExpirationTime = date.getTime() - new Date(Date.now()).getTime();
            if (tokenExpirationTime < TokenHandler.MAX_SET_TIMEOUT_TIME) {
                this.tokenTimeoutRef = window.setTimeout(this.tokenExpiredHandler.bind(this), tokenExpirationTime);
            }
        } catch (error) {
            Logger.log(error);
        }
    }
}
