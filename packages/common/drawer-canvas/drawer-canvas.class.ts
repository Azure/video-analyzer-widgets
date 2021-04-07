import { IPoint } from './drawer-canvas.definitions';
import { CanvasElement } from '../canvas/canvas.element';
import { ICanvasOptions } from '../canvas/canvas.definitions';
import { closestElement } from './../utils/elements';

/**
 * DrawerCanvas class is an implementation of CanvasElement
 * and draws lines over canvas element.
 * @public
 */
export class DrawerCanvas extends CanvasElement {
    // Canvas prop
    private _canvasOptions: ICanvasOptions;
    private _canvasX: number = 0;
    private _canvasY: number = 0;

    // Line attributes
    private _borderColor: string;
    private _pointsLimit: number;
    private _points: IPoint[] = [];

    // Mouse properties
    private _isDrawCompleted: boolean;
    private _lastMouseX: number = 0;
    private _lastMouseY: number = 0;

    // Const readyOnly
    private readonly DRAW_LINE = 'round';
    private readonly DEFAULT_LINE_COLOR = '#DB4646';

    public constructor(canvasOptions: ICanvasOptions) {
        // Create canvas object
        super(canvasOptions);
        this._canvasOptions = canvasOptions;
    }

    // To-do: Responsive and scroll event to handle
    public resize(): void {
    }

    public draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.moveTo(this._points && this._points[0].x, this._points && this._points[0].y);

        for (const point of this._points) {
            // Start to draw
            this.context.lineTo(point.x, point.y);
        }
        this.context.stroke();
    }

    public drawLastLine() {
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context?.beginPath();

        const lastPointX = this._points && this._points[this._points.length - 1].x;
        const lastPointY = this._points && this._points[this._points.length - 1].y;

        // Start to draw
        this.context?.moveTo(this._lastMouseX, this._lastMouseY);
        this.context?.lineTo(lastPointX, lastPointY);
        this.context?.stroke();
    }

    public setContextStyle() {
        super.setContextStyle();
        this.context.strokeStyle = this._borderColor;
        this.context.lineJoin = this.DRAW_LINE;
        this.context.lineCap = this.DRAW_LINE;
    }

    public setCanvas(cWidth: number, cHeight: number, pointsLimit: number = 2) {
        this._borderColor = this._canvasOptions.lineColor || this.DEFAULT_LINE_COLOR;
        this._pointsLimit = pointsLimit;

        // Init canvas properties
        this.setCanvasSize(cWidth, cHeight);
        this.setCanvasStyle();
        this.setContextStyle();
    }

    public initBoundingCanvas() {
        // Init x,y after append to document.
        this._canvasY = this.canvas.getBoundingClientRect().top;
        this._canvasX = this.canvas.getBoundingClientRect().left;
    }

    public onDraw(e: MouseEvent) {
        if (this._isDrawCompleted) {
            return;
        }

        const lastMouseX = e.clientX - this._canvasX;
        const lastMouseY = e.clientY - this._canvasY;

        this._points?.push({
            x: lastMouseX,
            y: lastMouseY
        });

        if (this._points?.length === this._pointsLimit) {
            this.onDrawComplete();
        }

        this.draw();
    }

    public onMouseMove(e: MouseEvent) {
        if (!this._points?.length || this._isDrawCompleted) {
            return;
        }

        this._lastMouseX = e.clientX - this._canvasX;
        this._lastMouseY = e.clientY - this._canvasY;

        this.drawLastLine();
    }

    public onDrawComplete() {
        this._isDrawCompleted = true;
        const customEvent = new CustomEvent('drawerComplete', {
            bubbles: true
        });
        // Trigger event to parent component.
        this.canvas.dispatchEvent(customEvent);
    }

    public get points(): IPoint[] {
        return this._points;
    }
}
