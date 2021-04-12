import EventEmitter from 'node:events';
import { isJwtTokenExpired } from './auth.utils';

export class TokenHandler {
    public static tokenExpiredEvent: EventEmitter;
    private static _avaAPIToken = '';

    private static tokenIntervalChecker = 0;

    public static get avaAPIToken() {
        return TokenHandler._avaAPIToken;
    }

    public static set avaAPIToken(value) {
        TokenHandler._avaAPIToken = value;
        this.init();
    }

    private static tokenExpiredHandler() {
        // First, check if token expired
        if (isJwtTokenExpired(this.avaAPIToken)) {
            // If expired, emit an event
            this.tokenExpiredEvent.emit('token_expired');

            // Clear interval
            window.clearInterval(this.tokenIntervalChecker);
            this.tokenIntervalChecker = 0;
        }
    }

    private static init() {
        if (this.tokenIntervalChecker !== 0) {
            // Clear existing interval
            window.clearInterval(this.tokenIntervalChecker);
            this.tokenIntervalChecker = 0;
        }

        this.tokenIntervalChecker = window.setInterval(this.tokenExpiredHandler.bind(this, 100));
    }
}
