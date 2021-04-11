import { CanvasElement } from '../../../common/canvas/canvas.element';
import { IAreasOptions } from './areas-view.definitions';

/**
 * AreasCanvas class is an implementation of CanvasElement
 * shows lines over canvas element.
 * @public
 */
export class AreasCanvas extends CanvasElement {
    private _areasOptions: IAreasOptions;

    public constructor(areasOptions: IAreasOptions) {
        super(areasOptions);
        this.areasOptions = areasOptions;

        this.resize();
    }

    public get areasOptions() {
        return this._areasOptions;
    }

    public set areasOptions(options: IAreasOptions) {
        this._areasOptions = options;
    }

    public draw(): void {
        if (!this.areasOptions.areas.length) {
            return;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const area of this.areasOptions.areas) {
            this.context.beginPath();
            this.context.strokeStyle = area.color;
            this.context.moveTo(
                area.points[0].x * this.areasOptions.width * this.ratio,
                area.points[0].y * this.areasOptions.height * this.ratio
            );

            for (const point of area.points) {
                this.context.lineTo(point.x * this.areasOptions.width * this.ratio, point.y * this.areasOptions.height * this.ratio);
            }
            this.context.stroke();
        }
    }
    public resize(): void {
        this.setCanvasSize(this.areasOptions.width, this.areasOptions.height);
        this.setContextStyle();
        this.draw();
    }
}
