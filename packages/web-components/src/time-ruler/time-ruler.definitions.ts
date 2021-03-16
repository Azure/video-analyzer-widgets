import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';

export interface IRulerOptions extends ICanvasOptions {
    smallScaleColor: string;
    timeColor: string;
    dateText: string;
    zoom?: number;
}
