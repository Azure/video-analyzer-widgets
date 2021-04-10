import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { IArea } from '../../../widgets/src/area-draw/area-draw.definitions';

// export interface IArea {
//     name: string; // Area name need to be unique
//     color: string;
//     points: IPoint[];
// }

export interface IAreasOptions extends ICanvasOptions {
    areas: IArea[];
}
