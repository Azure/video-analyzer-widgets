import { IPoint } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';

/**
 * ZoneDraw config, contains basic configurations for ZoneDraw widget.
 */
export interface IZoneDrawWidgetConfig extends IWidgetBaseConfig {
    /**
     * This the zones
     */
    zones?: IZone[];
}

export interface IZone {
    id?: string;
    name?: string;
    color: string;
    points: IPoint[];
}

export enum ZoneDrawMode {
    Line = 'line',
    Polygon = 'polygon'
}

export interface IZoneOutput {
    '@type': string;
    name: string;
    polygon?: IPoint[];
    line?: IPoint[];
}

export enum ZoneDrawEvents {
    Save = 'ZONE_DRAW_SAVE_CLICKED'
}
