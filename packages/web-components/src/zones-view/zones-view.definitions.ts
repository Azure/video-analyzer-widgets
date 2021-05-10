import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { IZone } from '../../../widgets/src/zone-drawer/zone-drawer.definitions';

export interface IPoint {
    x: number;
    y: number;
    cursor?: number;
}

export interface IZonesOptions extends ICanvasOptions {
    zones: IZone[];
}
