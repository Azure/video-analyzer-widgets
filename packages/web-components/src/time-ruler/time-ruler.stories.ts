import { TimeRulerComponent } from '.';
import { AvaDesignSystemProvider } from '../../../styles';

interface ITemplate {
    darkTheme?: boolean;
    date?: Date;
}

// Prevent tree-shaking
AvaDesignSystemProvider;
TimeRulerComponent;

const TimeRulerComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;
    const timeRuler = document.createElement('media-time-ruler') as TimeRulerComponent;

    if (data.darkTheme) {
        designSystem.theme = 'dark';
    } else {
        designSystem.theme = '';
    }

    if (data.date) {
        const date = new Date(data.date);
        console.log(date);
        timeRuler.date = date;
    }

    designSystem.appendChild(timeRuler);
    return designSystem;
};

export const TimeRuler = (args: ITemplate) => TimeRulerComponentTemplate(args);

export default {
    title: 'Time Ruler Component',
    argTypes: {
        darkTheme: { control: 'boolean', defaultValue: true },
        date: { control: 'date' }
    }
};
