export interface IUIAppearance {
    startSeconds: number;
    endSeconds: number;
    className?: string;
}

export interface IDisplayOptions {
    height: number;
    barHeight?: number;
    tooltipHeight?: number;
    top?: number;
    renderTooltip?: boolean;
    renderProgress?: boolean;
}

export interface ITimeLineData {
    appearances: IUIAppearance[];
    duration: number;
}

export interface ITimeLineConfig {
    data: ITimeLineData;
    displayOptions: IDisplayOptions;
}
