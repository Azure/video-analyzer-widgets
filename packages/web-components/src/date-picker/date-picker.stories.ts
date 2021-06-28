import { DatePickerComponent } from '.';
import { SegmentsTimelineComponent } from '..';
import { AvaDesignSystemProvider } from '../../../styles';

interface ITemplate {
    date: string;
    allowedMonths: string;
    allowedYears: string;
    allowedDays: string;
}

// Prevent tree-shaking
DatePickerComponent;
SegmentsTimelineComponent;

const DatePickerComponentTemplate = (data: ITemplate) => {
    const datePicker = document.createElement('media-date-picker') as DatePickerComponent;
    if (data.allowedMonths) {
        datePicker.allowedDates.months = data.allowedMonths;
    }
    if (data.allowedYears) {
        datePicker.allowedDates.years = data.allowedYears;
    }
    if (data.allowedDays) {
        datePicker.allowedDates.days = data.allowedDays;
    }
    if (data.date) {
        datePicker.date = new Date(data.date);
    }
    const designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;
    designSystem.appendChild(datePicker);
    return designSystem;
};

export const Example = (args: ITemplate) => DatePickerComponentTemplate(args);

export default {
    title: 'Date Picker Component',
    argTypes: {
        date: { control: 'text' },
        allowedMonths: { control: 'text' },
        allowedYears: { control: 'text' },
        allowedDays: { control: 'text' }
    }
};
