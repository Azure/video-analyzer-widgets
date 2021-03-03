import { TimeLineComponent } from '.';
import { ITimeLineConfig } from './time-line-component.definitions';

interface ITemplate {
    config: ITimeLineConfig;
    duration?: number;
    renderTooltip?: true;
    renderProgress?: true;
}

const appearances = [
    { endSeconds: 43.294, startSeconds: 42.209 },
    { endSeconds: 45.838, startSeconds: 44.711 },
    { endSeconds: 50.175, startSeconds: 49.466 },
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

const emptyConfig: ITimeLineConfig = {
    data: {
        appearances: appearances,
        duration: 90
    },
    displayOptions: displayOptions
};

// Prevent tree-shaking
TimeLineComponent;

const TimeLineComponentTemplate = (data: ITemplate) => {
    let config = { ...emptyConfig };
    if (data.config) {
        config = data.config;
    }

    if (data.duration && data.duration > 0) {
        config.data.duration = data.duration;
    }

    config.displayOptions.renderProgress = !!data.renderProgress;
    config.displayOptions.renderTooltip = !!data.renderTooltip;

    const timeline = document.createElement('time-line-component') as TimeLineComponent;
    timeline.config = config;

    return timeline;
};

export const TimeLine = (args: ITemplate) => TimeLineComponentTemplate(args);

export default {
    title: 'Tine Line Component',
    argTypes: {
        duration: { control: 'number', defaultValue: 90 },
        renderTooltip: { control: 'boolean', defaultValue: true },
        renderProgress: { control: 'boolean', defaultValue: true }
    }
};
