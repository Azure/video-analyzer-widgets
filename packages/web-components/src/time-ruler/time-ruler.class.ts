import { ICanvasElement, ICanvasFillData } from '../../../common/definitions/canvas.definitions';
import { toTimeText } from '../../../common/utils/time';
import { IRulerOptions } from './time-ruler.definitions';

// canvas common interface

export class TimeRuler extends ICanvasElement {
    public canvasPointsDataList: ICanvasFillData[] = [];
    private rulLength: number = 0;
    private rulThickness: number = 0;
    private rulScale: number = 0;
    private zoom: number = 1;
    private startPos: number = 0;
    private rulerOptions?: IRulerOptions;
    private readonly HOURS_IN_DAY = 24;
    private readonly TENS_MINUTES_IN_HOUR = 6;
    private readonly MIN_HOURS_GAP = 300;
    private readonly SMALL_SCALE_MARK_HEIGHT = 4;
    private readonly LARGE_SCALE_MARK_HEIGHT = 8;
    public constructor(canvas: HTMLCanvasElement, options: IRulerOptions) {
        super(canvas);
        this.rulerOptions = options;
    }

    public setOptions(options: IRulerOptions) {
        this.rulerOptions = options;
    }

    public draw(): void {
        this.rulLength = this.rulerOptions.width;
        this.rulThickness = this.rulerOptions.height;
        if (this.canvas) {
            this.setCanvasSize(this.rulerOptions.width, this.rulerOptions.height);
        }

        if (this.context) {
            this.context.font = `${this.getFontSize()}px ${this.rulerOptions?.fontFamily}`;
            this.context.lineWidth = this.rulerOptions?.lineWidth || 1;
            this.context.beginPath();
            this.preparePoints();
            setTimeout(() => {
                this.drawPoints();
                this.context.stroke();
                this.context.restore();
            }, 100);
        }
    }

    public preparePoints() {
        const minutes = ((this.rulLength - this.context.lineWidth) * this.zoom) / (this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR);

        const timeOccurrences = this.nearestPow2(Math.floor((this.rulLength * this.ratio) / this.MIN_HOURS_GAP));
        const timeOccurrencesGap = (this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR) / timeOccurrences;

        this.canvasPointsDataList = [];
        let lastHourMark = 0;

        // Drawing ruler line
        for (let i = 0; i <= (this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR) / this.zoom; i += 1) {
            const pos = i * minutes + this.startPos;

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
                        y: (this.rulThickness - 2) * this.ratio,
                        color: this.rulerOptions?.fontColor,
                        text: toTimeText(3600 * (i / this.TENS_MINUTES_IN_HOUR))
                    });
                }
            } else if (this.canvas && this.canvas.width > 520) {
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
                    y: (this.rulThickness - 2) * this.ratio,
                    color: this.rulerOptions?.fontColor,
                    text: this.rulerOptions.dateText
                });
            }
        }
    }

    public drawPoints() {
        for (const point of this.canvasPointsDataList) {
            if (point.text) {
                this.context.fillStyle = this.rulerOptions?.fontColor;
                this.context?.fillText(point.text, point.x, point.y);
            } else {
                this.context.fillStyle = point.color;
                this.context?.fillRect(point.x, point.y, point.w, point.h);
            }
        }
    }

    private nearestPow2(num: number) {
        return Math.pow(2, Math.round(Math.log(num) / Math.log(2)));
    }

    private getFontSize() {
        return this.rulerOptions.fontSize ? +this.rulerOptions.fontSize.split('px')[0] * this.ratio : 12;
    }
}
