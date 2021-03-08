import { Rect, Tooltip } from './models';

// interfaces
export interface IShowable {
    show(): void;
    hide(): void;
}

export interface IChartOptions {
    width: number;
    height: number;
    data: IChartData[];
    time: number;
    barHeight?: number;
    tooltipHeight?: number;
    top?: number;
    renderTooltip?: boolean;
    renderProgress?: boolean;
    renderBuffer?: boolean;
}

export interface IChartData {
    width?: number;
    type?: string;
    x?: number;
    ex?: number; // End X Pos
    selected?: boolean;
    color?: string;
    textColor?: string;
}

export interface IProgressBar {
    progress: Rect;
    buffer: Rect;
    overlay: Rect;
    bar: Rect;
    tooltip: Tooltip;
}

export interface IComponentTree {
    progressBar: IProgressBar;
    events: Rect[];
}

export const Colors = {
    positive: '#1abc9c',
    negative: '#e83128',
    neutral: 'rgba(0,0,0,0)',
    default: 'rgba(0,0,0,0.08)'
};

export const TrimSpacesRegEx: RegExp = /(  +)|(?:\r\n|\r|\n|\r\s)/g;
