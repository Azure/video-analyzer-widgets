import { AppearancesLineComponent } from '.';
import { IAppearancesLineConfig } from './appearances-line-component.definitions';

interface ITemplate {
    config: IAppearancesLineConfig;
    duration?: number;
    renderTooltip?: true;
    renderProgress?: true;
    timeSmoothing?: number;
}

const appearances = [
    { endSeconds: 43.294, startSeconds: 42.209 },
    { endSeconds: 45.838, startSeconds: 44.711 },
    { endSeconds: 50.175, startSeconds: 49.466, color: 'blue' },
    { endSeconds: 53.095, startSeconds: 51.468 }
];

const displayOptions = {
    height: 48,
    barHeight: 12,
    tooltipHeight: 20,
    top: 0,
    renderTooltip: true,
    renderProgress: true
};

const emptyConfig: IAppearancesLineConfig = {
    data: {
        appearances: appearances,
        duration: 90
    },
    displayOptions: displayOptions
};

// Prevent tree-shaking
AppearancesLineComponent;

const AppearancesLineComponentTemplate = (data: ITemplate) => {
    let config = { ...emptyConfig };
    if (data.config) {
        config = data.config;
    }

    if (data.duration && data.duration > 0) {
        config.data.duration = data.duration;
    }

    config.displayOptions.renderProgress = !!data.renderProgress;
    config.displayOptions.renderTooltip = !!data.renderTooltip;
    config.timeSmoothing = data.timeSmoothing;

    const appearancesLine = document.createElement('appearances-line-component') as AppearancesLineComponent;
    appearancesLine.style.setProperty('--appearances-line-bg', 'rgba(0, 0, 0, 0.05)');
    appearancesLine.style.setProperty('--appearances-progress-color', 'rgba(189, 224, 255, 1)');
    appearancesLine.style.setProperty('--appearances-tooltip', 'rgba(0, 0, 0, 0.08');
    appearancesLine.style.setProperty('--appearances-color', 'rgba(0, 0, 0, 0.8)');
    appearancesLine.style.setProperty('--appearances-tooltip-text', '#f7f7f7');
    appearancesLine.config = config;

    return appearancesLine;
};

export const AppearancesLine = (args: ITemplate) => AppearancesLineComponentTemplate(args);

export default {
    title: 'Appearances Line Component',
    argTypes: {
        duration: { control: 'number', defaultValue: 90 },
        timeSmoothing: { control: 'number', defaultValue: 0 },
        renderTooltip: { control: 'boolean', defaultValue: true },
        renderProgress: { control: 'boolean', defaultValue: true }
    }
};
