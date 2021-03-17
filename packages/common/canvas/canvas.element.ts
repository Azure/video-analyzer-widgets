import { ICanvasOptions } from './canvas.definitions';

// CanvasElement is abstract class for components that use canvas
// basic class that create canvas with options configuration
// use setCanvasSize to draw make the canvas with the right width and height depending on the ratio
export abstract class CanvasElement {
    public context: CanvasRenderingContext2D;
    public ratio = 1;

    private _canvas: HTMLCanvasElement;
    private options: ICanvasOptions;

    public constructor(options: ICanvasOptions) {
        this._canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.options = options;
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public setCanvasSize(width: number, height: number): void {
        if (!this.canvas) {
            return;
        }

        this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        const style = this.canvas.style;
        this.ratio = window.devicePixelRatio || 1;

        style.width = width + 'px';
        style.height = height + 'px';

        this._canvas.width = width * this.ratio;
        this._canvas.height = height * this.ratio;

        this.context.font = `${this.getFontSize()}px ${this.options?.fontFamily}`;
        this.context.lineWidth = this.options?.lineWidth || 1;
    }

    private getFontSize() {
        return this.options.fontSize ? +this.options.fontSize.split('px')[0] * this.ratio : 12;
    }

    public abstract draw(): void;

    public abstract resize(): void;
}
