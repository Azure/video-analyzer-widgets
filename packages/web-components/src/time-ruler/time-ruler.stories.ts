import { TimeRulerComponent } from '.';
import { AvaDesignSystemProvider } from '../../../styles';

interface ITemplate {
    darkTheme?: boolean;
    startDate?: Date;
}

// Prevent tree-shaking
AvaDesignSystemProvider;
TimeRulerComponent;

const TimeRulerComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;
    const timeRuler = document.createElement('media-time-ruler') as TimeRulerComponent;

    designSystem.theme = (data?.darkTheme && 'dark') || '';

    if (data.startDate) {
        const startDate = new Date(data.startDate);
        timeRuler.startDate = startDate;
    }

    designSystem.appendChild(timeRuler);
    return designSystem;
};

export const TimeRuler = (args: ITemplate) => TimeRulerComponentTemplate(args);

export default {
    title: 'Time Ruler Component',
    argTypes: {
        darkTheme: { control: 'boolean', defaultValue: true },
        startDate: { control: 'date' }
    }
};
