import { SeekBar, Rect, Tooltip } from './svg-progress.models';

// interfaces
export interface IShowable {
    show(): void;
    hide(): void;
}

export interface ISeekBar {
    seekBarTopColor: string;
    seekBarBodyColor: string;
}

export interface IChartOptions {
    width: number;
    height: number;
    data: IChartData[];
    time: number;
    barHeight?: number;
    tooltipHeight?: number;
    top?: number;
    bufferTop?: number;
    renderTooltip?: boolean;
    renderProgress?: boolean;
    renderSeek?: ISeekBar;
    renderBuffer?: boolean;
    disableCursor?: boolean; // Disable cursor on un segment parts
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
    bar: Rect;
    seekBar: SeekBar;
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
