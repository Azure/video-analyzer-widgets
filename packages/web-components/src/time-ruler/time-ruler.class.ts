import { toTimeText } from '../../../common/utils/time';
import { IRulerOptions } from './time-ruler.definitions';

export class TimeRuler {
    private rulLength: number = 0;
    private rulThickness: number = 0;
    private rulScale: number = 0;
    private context?: CanvasRenderingContext2D;
    private canvas?: HTMLCanvasElement;
    private rulerOptions?: IRulerOptions;
    private ratio: number = 1;
    private readonly HOURS_IN_DAY = 24;
    private readonly TENS_MINUTES_IN_HOUR = 6;
    private readonly MIN_HOURS_GAP = 300;
    private readonly SMALL_SCALE_MARK_HEIGHT = 4;
    private readonly LARGE_SCALE_MARK_HEIGHT = 8;
    public constructor(canvas: HTMLCanvasElement, options: IRulerOptions) {
        this.canvas = canvas;
        this.rulerOptions = options;
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    }

    public setOptions(options: IRulerOptions) {
        this.rulerOptions = options;
    }

    public drawRuler(_rulerLength: number, _rulerThickness: number, _rulerScale?: number) {
        this.rulLength = Math.floor(_rulerLength);
        this.rulThickness = _rulerThickness;
        this.rulScale = _rulerScale || 1;
        if (this.canvas) {
            this.setCanvasSize(this.canvas, _rulerLength, _rulerThickness);
        }

        if (this.context) {
            this.context.font = `${this.getFontSize()}px ${this.rulerOptions?.fontFamily}`;
            this.context.lineWidth = this.rulerOptions?.lineWidth || 1;
            this.context.beginPath();
            setTimeout(() => {
                this.drawPoints();
                this.context.stroke();
            }, 100);
        }
    }

    public drawPoints() {
        const minutes = (this.rulLength - this.context.lineWidth) / (this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR);

        // Drawing ruler line
        for (let i = 0; i <= this.HOURS_IN_DAY * this.TENS_MINUTES_IN_HOUR; i += 1) {
            const pos = i * minutes;

            // Large Scale mark
            if (i % this.TENS_MINUTES_IN_HOUR === 0) {
                this.context.fillStyle = this.rulerOptions?.textColor;
                this.context?.fillRect(pos * this.ratio, 0, this.context.lineWidth * this.ratio, this.LARGE_SCALE_MARK_HEIGHT * this.ratio);
            } else if (this.canvas && this.canvas.width > 520) {
                // Small Scale mark
                this.context.fillStyle = this.rulerOptions?.smallScaleColor;
                this.context?.fillRect(pos * this.ratio, 0, this.context.lineWidth * this.ratio, this.SMALL_SCALE_MARK_HEIGHT * this.ratio);
            }

            // Start Date tag
            if (i === 0) {
                this.context.fillStyle = this.rulerOptions?.textColor;
                this.context?.fillText(this.rulerOptions.dateText, 2, (this.rulThickness - 2) * this.ratio);
            }
        }

        // Drawing Hours line
        const timeOccurrences = this.nearestPow2(Math.floor((this.rulLength * this.ratio) / this.MIN_HOURS_GAP));
        const hoursRatio = 1 / timeOccurrences;
        for (let j = 1; j < timeOccurrences; j++) {
            this.context.fillStyle = this.rulerOptions?.textColor;
            this.context?.fillText(
                toTimeText(3600 * (hoursRatio * j) * 24),
                this.rulLength * this.ratio * hoursRatio * j - this.rulerOptions.lineWidth * this.ratio,
                (this.rulThickness - 2) * this.ratio
            );
        }
    }

    private nearestPow2(num: number) {
        return Math.pow(2, Math.round(Math.log(num) / Math.log(2)));
    }

    private setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number) {
        const style = canvas.style;
        this.ratio = window.devicePixelRatio || 1;

        style.width = width + 'px';
        style.height = height + 'px';

        canvas.width = width * this.ratio;
        canvas.height = height * this.ratio;
    }

    private getFontSize() {
        return this.rulerOptions.fontSize ? +this.rulerOptions.fontSize.split('px')[0] * this.ratio : 12;
    }
}
