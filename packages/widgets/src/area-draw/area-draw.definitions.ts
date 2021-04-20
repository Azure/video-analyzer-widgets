import { IPoint } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';

/**
 * AreaDraw config, contains basic configurations for AreaDraw widget.
 */
export interface IAreaDrawWidgetConfig extends IWidgetBaseConfig {
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
