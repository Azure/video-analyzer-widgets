export class WidgetGeneralError extends Error {
    private static errorName = 'WidgetGeneralError';

    public constructor(public message: string) {
        super(`${WidgetGeneralError.errorName}: ${message}`);
        this.name = WidgetGeneralError.errorName;
    }
}
