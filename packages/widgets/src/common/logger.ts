export class Logger {
    private static _debugMode = false;

    public constructor(public mode?: boolean) {
        Logger.debugMode = mode;
    }

    public static set debugMode(mode: boolean) {
        this._debugMode = mode;
    }

    public static get debugMode() {
        return this._debugMode;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static log(...msg: any) {
        if (Logger.debugMode) {
            // eslint-disable-next-line no-console
            console.log(...msg);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static error(...msg: any) {
        if (Logger.debugMode) {
            // eslint-disable-next-line no-console
            console.error(...msg);
        }
    }
}
