import { IPoint } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';

/**
 * ZoneDraw config, contains basic configurations for ZoneDraw widget.
 */
export interface IZoneDrawerWidgetConfig extends IWidgetBaseConfig {
    /**
     * Zones according to template
     */
    zones?: (IPolygonZone | ILineZone)[];
    /**
     * Disable the drawing
     */
    disableDrawing?: boolean;
}

export interface IZone {
    id?: string;
    name?: string;
    color: string;
    points: IPoint[];
    type?: ZoneDrawerMode;
}

export interface IZoneTemplate {
    '@type': ZoneType;
    name: string;
}

export type ZoneType = '#Microsoft.VideoAnalyzer.NamedPolygonString' | '#Microsoft.VideoAnalyzer.NamedLineString';

export interface IPolygonZone extends IZoneTemplate {
    polygon: IPoint[];
}

export interface ILineZone extends IZoneTemplate {
    line: IPoint[];
}

export enum ZoneDrawerWidgetEvents {
    ADDED_ZONE = 'ZONE_DRAWER_ADDED_ZONE',
    REMOVED_ZONE = 'ZONE_DRAWER_REMOVED_ZONE',
    SAVE = 'ZONE_DRAWER_SAVE'
}

export enum ZoneDrawerMode {
    Line = 'line',
    Polygon = 'polygon'
}
