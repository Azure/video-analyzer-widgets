import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';

export interface IPoint {
    x: number;
    y: number;
    cursor?: number;
}

export interface IZone {
    id?: string;
    name?: string;
    color: string;
    points: IPoint[];
}

export interface IZonesOptions extends ICanvasOptions {
    zones: IZone[];
}
