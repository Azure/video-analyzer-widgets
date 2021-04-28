import { IPoint } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { DrawingColors } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';

/**
 * AreaDraw config, contains basic configurations for AreaDraw widget.
 */
export interface IZoneDrawWidgetConfig extends IWidgetBaseConfig {
    /**
     * This the areas
     */
    areas?: IArea[];
}

export interface IArea {
    id: string;
    name: string;
    color: string;
    points: IPoint[];
}

export enum AreaDrawMode {
    Line = 'line',
    Polygon = 'polygon'
}

export enum ColorsRanking {
    Red = 0,
    LightBlue = 1,
    Yellow = 2,
    Magenta = 3,
    Teal = 4,
    Purple = 5,
    Lime = 6,
    Blue = 7,
    Green = 8,
    Orange = 9
}

export interface IAreaOutput {
    '@type': string;
    name: string;
    polygon?: IPoint[];
    line?: IPoint[];
}
