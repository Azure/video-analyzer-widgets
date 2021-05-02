import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { IZone } from '../../../widgets/src/zone-draw/zone-draw.definitions';

export interface IPoint {
    x: number;
    y: number;
    cursor?: number;
}

export interface IZonesOptions extends ICanvasOptions {
    zones: IZone[];
}
