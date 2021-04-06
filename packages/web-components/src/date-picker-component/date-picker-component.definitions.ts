export enum DatePickerEvent {
    RENDER = 'DATE_PICKER_RENDER',
    DATE_CHANGE = 'DATE_PICKER_CHANGE'
}

export interface IDatePickerRenderEvent {
    month: Date;
    year: Date;
}
