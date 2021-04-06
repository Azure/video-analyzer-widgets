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
    lineWidth?: number;
    fontFamily?: string;
    fontSize?: string;
    fontColor?: string;
    cursor?: string;
    position?: string;
}
