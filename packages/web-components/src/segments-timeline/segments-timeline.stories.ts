import { SegmentsTimelineComponent } from '.';
import { ISegmentsTimelineConfig } from './segments-timeline.definitions';

interface ITemplate {
    config: ISegmentsTimelineConfig;
    duration?: number;
    renderTooltip?: true;
    renderProgress?: true;
    timeSmoothing?: number;
}

const segments = [
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

const emptyConfig: ISegmentsTimelineConfig = {
    data: {
        segments: segments,
        duration: 90
    },
    displayOptions: displayOptions
};

// Prevent tree-shaking
SegmentsTimelineComponent;

const SegmentsTimelineComponentTemplate = (data: ITemplate) => {
    let config = { ...emptyConfig };
    if (data.config) {
        config = data.config;
    }

    if (data.duration && data.duration > 0) {
        config.data.duration = data.duration;
    }

    config.displayOptions.renderProgress = !!data.renderProgress;
    config.displayOptions.renderTooltip = !!data.renderTooltip;
    config.displayOptions.timeSmoothing = data.timeSmoothing;

    const segmentsLine = document.createElement('media-segments-timeline') as SegmentsTimelineComponent;
    segmentsLine.style.setProperty('--segments-line-bg', 'rgba(0, 0, 0, 0.05)');
    segmentsLine.style.setProperty('--segments-progress-color', 'rgba(189, 224, 255, 1)');
    segmentsLine.style.setProperty('--segments-tooltip', 'rgba(0, 0, 0, 0.08');
    segmentsLine.style.setProperty('--segments-color', 'rgba(0, 0, 0, 0.8)');
    segmentsLine.style.setProperty('--segments-tooltip-text', '#f7f7f7');
    segmentsLine.config = config;

    return segmentsLine;
};

export const SegmentsTimeline = (args: ITemplate) => SegmentsTimelineComponentTemplate(args);

export default {
    title: 'Segments Timeline Component',
    argTypes: {
        duration: { control: 'number', defaultValue: 90 },
        timeSmoothing: { control: 'number', defaultValue: 0 },
        renderTooltip: { control: 'boolean', defaultValue: true },
        renderProgress: { control: 'boolean', defaultValue: true }
    }
};
