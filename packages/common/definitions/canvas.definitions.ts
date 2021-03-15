export interface ICanvasFillData {
    x: number;
    y: number;
    color: string;
    w?: number;
    h?: number;
    text?: string;
}

export interface ICanvasOptions {
    height: number;
    width: number;
    lineWidth: number;
    fontFamily: string;
    fontSize: string;
    fontColor: string;
}

export abstract class ICanvasElement {
    public context: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;
    public ratio: number = 1;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    }

    public setCanvasSize(width: number, height: number): void {
        const style = this.canvas.style;
        this.ratio = window.devicePixelRatio || 1;

        style.width = width + 'px';
        style.height = height + 'px';

        this.canvas.width = width * this.ratio;
        this.canvas.height = height * this.ratio;
    }

    public abstract draw(): void;
}
