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
    className?: string;
    x?: number;
    ex?: number; // End X Pos
    selected?: boolean;
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
    default: '#2C3E50'
};

export const TrimSpacesRegEx: RegExp = /(  +)|(?:\r\n|\r|\n|\r\s)/g;
