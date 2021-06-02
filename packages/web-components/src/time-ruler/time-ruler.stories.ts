import { TimeRulerComponent } from '.';
import { AvaDesignSystemProvider } from '../../../styles';
import { AvaTheme } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { Localization } from './../../../common/services/localization/localization.class';

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

    designSystem.theme = (data?.darkTheme && AvaTheme.Dark) || '';

    if (data.startDate) {
        const startDate = new Date(data.startDate);
        timeRuler.startDate = startDate;
    }

    designSystem.appendChild(timeRuler);
    return designSystem;
};

export const TimeRuler = (args: ITemplate) => TimeRulerComponentTemplate(args);

export default {
    title: Localization.dictionary.TIME_RULER_ComponentTitle,
    argTypes: {
        darkTheme: { control: 'boolean', defaultValue: true },
        startDate: { control: 'date' }
    }
};
