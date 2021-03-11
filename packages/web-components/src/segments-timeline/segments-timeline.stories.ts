import { SegmentsTimelineComponent } from '.';
import { AvaDesignSystemProvider } from '../../../styles';
import { ISegmentsTimelineConfig } from './segments-timeline.definitions';

// Prevent tree-shaking
AvaDesignSystemProvider;
SegmentsTimelineComponent;

interface ITemplate {
    config: ISegmentsTimelineConfig;
    duration?: number;
    renderTooltip?: true;
    renderProgress?: true;
    timeSmoothing?: number;
    darkTheme?: boolean;
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
    const designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;
    if (data.darkTheme) {
        designSystem.theme = 'dark';
    } else {
        designSystem.theme = '';
    }
    const segmentsLine = document.createElement('media-segments-timeline') as SegmentsTimelineComponent;
    segmentsLine.config = config;
    designSystem.appendChild(segmentsLine);
    return designSystem;
};

export const SegmentsTimeline = (args: ITemplate) => SegmentsTimelineComponentTemplate(args);

export default {
    title: 'Segments Timeline Component',
    argTypes: {
        duration: { control: 'number', defaultValue: 90 },
        timeSmoothing: { control: 'number', defaultValue: 0 },
        renderTooltip: { control: 'boolean', defaultValue: true },
        renderProgress: { control: 'boolean', defaultValue: true },
        darkTheme: { control: 'boolean', defaultValue: true }
    }
};
