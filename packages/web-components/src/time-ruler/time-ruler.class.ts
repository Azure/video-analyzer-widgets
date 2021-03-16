import { ICanvasFillData } from '../../../common/canvas/canvas.definitions';
import { CanvasElement } from '../../../common/canvas/canvas.element';
import { toTimeText } from '../../../common/utils/time';
import { IRulerOptions } from './time-ruler.definitions';

export class TimeRuler extends CanvasElement {
    public canvasPointsDataList: ICanvasFillData[] = [];

    private _rulerOptions?: IRulerOptions;
    private readonly HOURS_IN_DAY = 24;
    private readonly TENS_MINUTES_IN_HOUR = 6;
    private readonly MIN_HOURS_GAP = 300;
    private readonly SMALL_SCALE_MARK_HEIGHT = 4;
    private readonly LARGE_SCALE_MARK_HEIGHT = 8;
    private readonly SECONDES_IN_HOUR = 3600;
    private readonly MIN_WIDTH_FOR_SMALL_SCALE = 520;

    public constructor(options: IRulerOptions) {
        super(options);
        this.rulerOptions = options;
        if (!this.rulerOptions.zoom) {
            this.rulerOptions.zoom = 1;
        }
    }

    public get rulerOptions() {
        return this._rulerOptions;
    }

    public set rulerOptions(options: IRulerOptions) {
        this._rulerOptions = options;
    }

    public draw(): void {
        this.setCanvasSize(this.rulerOptions.width * this.rulerOptions.zoom, this.rulerOptions.height);

        if (this.context) {
            this.context.beginPath();
            this.preparePoints();
            setTimeout(() => {
                this.drawPoints();
                this.context.stroke();
                this.context.restore();
            }, 50);
        }
    }

    public preparePoints() {
        const rulLength = this.rulerOptions.width * this.rulerOptions.zoom;
        const minutes = (rulLength - this.context.lineWidth) / (this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR);

        const timeOccurrences = this.nearestPow2(Math.floor((rulLength * this.ratio * this.rulerOptions.zoom) / this.MIN_HOURS_GAP));
        const timeOccurrencesGap = (this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR) / timeOccurrences;

        this.canvasPointsDataList = [];
        let lastHourMark = 0;

        // Drawing ruler line
        for (let i = 0; i <= this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR; i += 1) {
            const pos = i * minutes;

            // Large scale mark
            if (i % this.TENS_MINUTES_IN_HOUR === 0) {
                this.canvasPointsDataList.push({
                    x: pos * this.ratio,
                    y: 0,
                    w: this.context.lineWidth * this.ratio,
                    h: this.LARGE_SCALE_MARK_HEIGHT * this.ratio,
                    color: this.rulerOptions?.fontColor
                });

                // Time hours mark
                if (i - lastHourMark >= timeOccurrencesGap && i !== this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR) {
                    lastHourMark = i;

                    this.canvasPointsDataList.push({
                        x: pos * this.ratio,
                        y: (this.rulerOptions.height - 2) * this.ratio,
                        color: this.rulerOptions?.timeColor,
                        text: toTimeText(this.SECONDES_IN_HOUR * (i / this.TENS_MINUTES_IN_HOUR))
                    });
                }
            } else if (this.canvas && this.canvas.width > this.MIN_WIDTH_FOR_SMALL_SCALE) {
                // Small scale mark
                this.canvasPointsDataList.push({
                    x: pos * this.ratio,
                    y: 0,
                    w: this.context.lineWidth * this.ratio,
                    h: this.SMALL_SCALE_MARK_HEIGHT * this.ratio,
                    color: this.rulerOptions?.smallScaleColor
                });
            }

            // Start Date tag
            if (i === 0) {
                this.canvasPointsDataList.push({
                    x: pos * this.ratio,
                    y: (this.rulerOptions.height - 2) * this.ratio,
                    color: this.rulerOptions?.fontColor,
                    text: this.rulerOptions.dateText
                });
            }
        }
    }

    public drawPoints() {
        for (const point of this.canvasPointsDataList) {
            this.context.fillStyle = point.color;
            if (point.text) {
                this.context?.fillText(point.text, point.x, point.y);
            } else {
                this.context?.fillRect(point.x, point.y, point.w, point.h);
            }
        }
    }

    private nearestPow2(num: number) {
        return Math.pow(2, Math.round(Math.log(num) / Math.log(2)));
    }
}
