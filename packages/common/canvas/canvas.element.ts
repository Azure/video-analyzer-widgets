import { ICanvasOptions } from './canvas.definitions';

export abstract class CanvasElement {
    public context: CanvasRenderingContext2D;
    public ratio = 1;

    private _canvas: HTMLCanvasElement;
    private options: ICanvasOptions;
    private readonly DEFAULT_FONT = 'Segoe UI';
    private readonly DEFAULT_CURSOR = 'default';
    private readonly DEFAULT_POSITION = 'relative';

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

        const style = this.canvas.style;
        this.ratio = window.devicePixelRatio || 1;

        style.width = width + 'px';
        style.height = height + 'px';

        this._canvas.width = width * this.ratio;
        this._canvas.height = height * this.ratio;
    }

    public setCanvasStyle() {
        this._canvas.style.position = this.options?.position || this.DEFAULT_POSITION;
        this._canvas.style.cursor = this.options?.cursor || this.DEFAULT_CURSOR;
    }

    public setContextStyle() {
        this.context.font = `${this.getFontSize()}px ${this.options?.fontFamily || this.DEFAULT_FONT}`;
        this.context.lineWidth = this.options?.lineWidth || 1;
    }

    public clear() {
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public getFontSize() {
        return this.options.fontSize ? +this.options.fontSize.split('px')[0] * this.ratio : 12 * this.ratio;
    }

    public abstract draw(): void;

    public abstract resize(): void;
}
