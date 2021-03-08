export interface IUIAppearance {
    startSeconds: number;
    endSeconds: number;
    className?: string;
    color?: string;
    textColor?: string;
}

export interface IDisplayOptions {
    height: number;
    barHeight?: number;
    tooltipHeight?: number;
    top?: number;
    renderTooltip?: boolean;
    renderProgress?: boolean;
}

export interface IAppearancesLineData {
    appearances: IUIAppearance[];
    duration: number;
}

export interface IAppearancesLineConfig {
    data: IAppearancesLineData;
    displayOptions: IDisplayOptions;
    timeSmoothing?: number;
}
