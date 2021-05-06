import { CanvasElement } from '../../../common/canvas/canvas.element';
import { IZonesOptions } from './zones-view.definitions';

/**
 * ZonesCanvas class is an implementation of CanvasElement
 * shows lines and polygons over canvas element.
 * @public
 */
export class ZonesCanvas extends CanvasElement {
    private _zonesOptions: IZonesOptions;

    public constructor(zonesOptions: IZonesOptions) {
        super(zonesOptions);
        this.zonesOptions = zonesOptions;

        this.resize();
    }

    public get zonesOptions() {
        return this._zonesOptions;
    }

    public set zonesOptions(options: IZonesOptions) {
        this._zonesOptions = options;
    }

    public draw(): void {
        if (!this.zonesOptions?.zones?.length) {
            return;
        }

        this.clear();
        for (const zone of this.zonesOptions.zones) {
            this.context.beginPath();
            this.context.strokeStyle = zone.color;
            this.context.globalAlpha = 1;
            this.context.moveTo(
                zone.points[0].x * this.zonesOptions.width * this.ratio,
                zone.points[0].y * this.zonesOptions.height * this.ratio
            );

            for (const point of zone.points) {
                this.context.lineTo(point.x * this.zonesOptions.width * this.ratio, point.y * this.zonesOptions.height * this.ratio);
            }

            if (zone.points.length > 2) {
                this.context.lineTo(
                    zone.points[0].x * this.zonesOptions.width * this.ratio,
                    zone.points[0].y * this.zonesOptions.height * this.ratio
                );
                this.context.fillStyle = zone.color;
                this.context.globalAlpha = 0.4;
                this.context.fill();
            }
            this.context.stroke();
        }
    }

    public resize(): void {
        this.setCanvasSize(this.zonesOptions.width, this.zonesOptions.height);
        this.setContextStyle();
        this.draw();
    }
}
