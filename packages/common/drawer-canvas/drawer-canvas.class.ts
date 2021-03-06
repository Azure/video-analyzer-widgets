import { CursorTypes, DrawerEvents, IPoint } from './drawer-canvas.definitions';
import { CanvasElement } from '../canvas/canvas.element';
import { ICanvasOptions } from '../canvas/canvas.definitions';
import { WidgetGeneralError } from './../../widgets/src/common/error';
import { DrawingColors } from '../../styles/system-providers/ava-design-system-provider.definitions';

/**
 * DrawerCanvas class is an implementation of CanvasElement
 * and draws lines over canvas element.
 * @public
 */
export class DrawerCanvas extends CanvasElement {
    // Canvas prop
    private _drawerOptions: ICanvasOptions;
    private _canvasX: number = 0;
    private _canvasY: number = 0;

    // Line attributes
    private _pointsLimit: number;
    private _points: IPoint[] = [];

    // Mouse properties
    private _isDrawCompleted: boolean;
    private _lastMouseX: number = 0;
    private _lastMouseY: number = 0;
    private _cursors = [CursorTypes.CROSSHAIR, CursorTypes.POINTER];
    private _currentCursor: number = 0;

    // Const readyOnly
    private readonly DRAW_LINE = 'round';
    private readonly DEFAULT_LINE_COLOR = DrawingColors.Red;
    private readonly DEFAULT_FILL_COLOR = 'rgba(219, 70, 70, 0.4)';
    private readonly DEFAULT_DRAW_CURSOR = 'crosshair';
    private readonly INITIAL_ANGELS_SUM = 0;
    private readonly PIXELS_DISTANCE_RANGE = 10;
    private readonly TRIANGLE_ANGLES_SUM = 180;

    public constructor(canvasOptions: ICanvasOptions) {
        // Create canvas object
        super(canvasOptions);
        this._drawerOptions = canvasOptions;
    }

    public get drawerOptions() {
        return this._drawerOptions;
    }

    public set drawerOptions(options: ICanvasOptions) {
        this._drawerOptions = options;
    }

    public resize(): void {
        this.setCanvasSize(this._drawerOptions.width, this._drawerOptions.height);
        this.setContextStyle();
        this.clearCanvas();
        this.draw();
    }

    public clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public draw(): void {
        if (this._points.length < 2) {
            return;
        }

        this.context.beginPath();

        const startPointX = this.getCalculatedPoint(this._points[0].x, this.drawerOptions.width * this.ratio);
        const startPointY = this.getCalculatedPoint(this._points[0].y, this.drawerOptions.height * this.ratio);
        this.context.moveTo(startPointX, startPointY);

        for (const point of this._points) {
            // Start to draw
            this.context.lineTo(
                this.getCalculatedPoint(point.x, this.drawerOptions.width * this.ratio),
                this.getCalculatedPoint(point.y, this.drawerOptions.height * this.ratio)
            );
        }

        if (this._isDrawCompleted) {
            this.closePolygon(startPointX, startPointY);
        }

        this.context.stroke();
    }

    public drawLastLine() {
        if (this.points?.length === 0) {
            return;
        }

        this.clearCanvas();
        this.draw();
        this.context?.beginPath();

        const lastPointX = this.getCalculatedPoint(this._points[this._points.length - 1].x, this.drawerOptions.width * this.ratio);
        const lastPointY = this.getCalculatedPoint(this._points[this._points.length - 1].y, this.drawerOptions.height * this.ratio);

        // Start to draw
        this.context?.moveTo(this._lastMouseX * this.ratio, this._lastMouseY * this.ratio);
        this.context?.lineTo(lastPointX, lastPointY);
        this.context?.stroke();
    }

    public setContextStyle() {
        super.setContextStyle();
        this.context.strokeStyle = this._drawerOptions.lineColor || this.DEFAULT_LINE_COLOR;
        this.context.fillStyle = this._drawerOptions.fillStyle || this.DEFAULT_FILL_COLOR;
        this.context.lineJoin = this.DRAW_LINE;
        this.context.lineCap = this.DRAW_LINE;
    }

    public setCanvas(cWidth: number, cHeight: number, pointsLimit: number = 2) {
        this._pointsLimit = pointsLimit;

        // Init canvas properties
        this.setCanvasSize(cWidth, cHeight);
        this.setCanvasStyle();
        this.setContextStyle();
    }

    public initBoundingCanvas() {
        // Init x,y after append to document.
        this._canvasX = this.canvas.getBoundingClientRect().left;
        this._canvasY = this.canvas.getBoundingClientRect().top;
    }

    public onDraw(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (this._isDrawCompleted) {
            return;
        }

        this.addPointToList(e);
        this.clearCanvas();
        this.draw();

        if (this._points?.length === this._pointsLimit) {
            this.onDrawComplete();
        }
    }

    public onMouseMove(e: MouseEvent) {
        if (this._isDrawCompleted || !this._points?.length) {
            return;
        }
        this.setCanvasCursor(e);
        this.drawLastLine();
    }

    public onDrawComplete() {
        this._isDrawCompleted = true;
        const customEvent = new CustomEvent(DrawerEvents.COMPLETE, {
            bubbles: true
        });
        // Trigger event to parent component.
        this.canvas.dispatchEvent(customEvent);
    }

    public clearPoints() {
        this._points.length = 0;
        this._isDrawCompleted = false;
        this.canvas.style.cursor = this.DEFAULT_DRAW_CURSOR;
    }

    public get points(): IPoint[] {
        return this._points;
    }

    // The Function calculate the accurate point by multiply the ratio point by width/height according to x/y relatively.
    private getCalculatedPoint(point: number, multiplierFactor: number) {
        return point * multiplierFactor;
    }

    private addPointToList(e: MouseEvent) {
        const lastMouseX = e.offsetX;
        const lastMouseY = e.offsetY;

        // Compare between the dots.
        // If the last click equal to the first one, close the polygon
        if (this._points.length > 1) {
            const clickX = this.getCalculatedPoint(this._points[0].x, this.drawerOptions.width);
            const clickY = this.getCalculatedPoint(this._points[0].y, this.drawerOptions.height);
            const diffX = Math.abs(lastMouseX - clickX);
            const diffY = Math.abs(lastMouseY - clickY);
            if (
                (diffX < this.PIXELS_DISTANCE_RANGE && diffY < this.PIXELS_DISTANCE_RANGE) ||
                this._points.length === this._pointsLimit - 1
            ) {
                this.calculateAngles();
                this.onDrawComplete();
                return;
            }
        }

        // Push the last click only if polygon not closed
        if (!this._isDrawCompleted) {
            this._points?.push({
                x: lastMouseX / this.drawerOptions.width,
                y: lastMouseY / this.drawerOptions.height,
                cursor: !this._points.length ? 1 : 0
            });
        }
    }

    private closePolygon(startPointX: number, startPointY: number) {
        this.context.lineTo(startPointX, startPointY);
        this.context.closePath();
        this.context.fill();
    }

    private calculateAngles() {
        const legalAnglesSum = this.TRIANGLE_ANGLES_SUM * (this._points?.length - 2);
        let polygonAnglesSum = this.INITIAL_ANGELS_SUM;
        const pointsLength = this.points?.length;
        for (const [i, pointA] of this._points.entries()) {
            const firstPointIndex = i === 0 ? pointsLength - 1 : i - 1;
            const secondPointIndex = i === 0 ? pointsLength - 2 : i === 1 ? pointsLength - 1 : i - 2;
            const pointB = this._points[firstPointIndex];
            const pointC = this._points[secondPointIndex];

            const angle = this.getAngle(
                {
                    x: this.getCalculatedPoint(pointA.x, this.drawerOptions.width),
                    y: this.getCalculatedPoint(pointA.y, this.drawerOptions.height)
                },
                {
                    x: this.getCalculatedPoint(pointB.x, this.drawerOptions.width),
                    y: this.getCalculatedPoint(pointB.y, this.drawerOptions.height)
                },
                {
                    x: this.getCalculatedPoint(pointC.x, this.drawerOptions.width),
                    y: this.getCalculatedPoint(pointC.y, this.drawerOptions.height)
                }
            );
            polygonAnglesSum += Math.abs(angle);
        }

        if (Math.round(polygonAnglesSum) !== legalAnglesSum) {
            this.clearCanvas();
            this.clearPoints();
            throw new WidgetGeneralError('Polygon not valid');
        }
    }

    private getAngle(pointA: IPoint, pointB: IPoint, pointC: IPoint) {
        const AB = Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
        const BC = Math.sqrt(Math.pow(pointB.x - pointC.x, 2) + Math.pow(pointB.y - pointC.y, 2));
        const AC = Math.sqrt(Math.pow(pointC.x - pointA.x, 2) + Math.pow(pointC.y - pointA.y, 2));

        return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
    }

    private setCanvasCursor(e: MouseEvent) {
        this._lastMouseX = e.offsetX;
        this._lastMouseY = e.offsetY;

        // Determine cursor by its position. Calculated only when polygon option is selected
        let newCursor;
        if (this._points?.length > 2) {
            const diffX = Math.abs(this._lastMouseX - this.getCalculatedPoint(this._points[0].x, this.drawerOptions.width));
            const diffY = Math.abs(this._lastMouseY - this.getCalculatedPoint(this._points[0].y, this.drawerOptions.height));

            const firstPoint = this._points[0];

            if (diffX < 10 && diffY < 10) {
                newCursor = firstPoint.cursor;
            }
            if (!newCursor) {
                if (this._currentCursor > 0) {
                    this._currentCursor = 0;
                    this.canvas.style.cursor = this._cursors[this._currentCursor];
                }
            } else if (newCursor !== this._currentCursor) {
                this._currentCursor = newCursor;
                this.canvas.style.cursor = this._cursors[this._currentCursor];
            }
        }
    }
}
