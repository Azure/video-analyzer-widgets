import { DatePickerComponent } from '.';
interface ITemplate {
    date: string;
    allowedMonths: string;
    allowedYears: string;
    allowedDays: string;
}

// Prevent tree-shaking
DatePickerComponent;

const DatePickerComponentTemplate = (data: ITemplate) => {
    const datePicker = document.createElement('date-picker-component') as DatePickerComponent;
    if (data.allowedMonths) {
        datePicker.allowedMonths = data.allowedMonths;
    }
    if (data.allowedYears) {
        datePicker.allowedYears = data.allowedYears;
    }
    if (data.allowedDays) {
        datePicker.allowedDays = data.allowedDays;
    }
    if (data.date) {
        datePicker.date = new Date(data.date);
    }
    return datePicker;
};

export const Example = (args: ITemplate) => DatePickerComponentTemplate(args);

export default {
    title: 'Date Picker Component',
    argTypes: {
        date: { control: 'text' },
        allowedMonths: { control: 'text' },
        text: { control: 'text' },
        allowedDays: { control: 'text' }
    }
};
