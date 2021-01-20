export class WidgetGeneralError extends Error {
    static errorName = 'WidgetGeneralError';

    constructor(public message: string) {
        super(`${WidgetGeneralError.errorName}: message`);
        this.name = WidgetGeneralError.errorName;
    }
}
