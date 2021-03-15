import { FASTElement } from '@microsoft/fast-element';
import { Colors } from './colors.definitions';
import { IPoint, IDrawPoint } from './drawer.definitions';

/**
 * The class handles:
 * 1. Creating canvas element and heat-map area by getting the boundaries of the areas as input.
 * 2. After drawing the line, the component emit the coordinates [x,y]
 */
export abstract class Drawer extends FASTElement {
    // Canvas prop
    public canvas: HTMLCanvasElement;
    public canvasX: number = 0;
    public canvasY: number = 0;
    public cCtx: CanvasRenderingContext2D | null;

    // Line attributes
    public borderColor: string;

    // Mouse properties
    private mouseDown: boolean = false;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;

    // Const readyOnly
    private readonly CANVAS_POSITION = 'relative';
    private readonly CANVAS_HEIGHT = 375;
    private readonly CANVAS_WIDTH = 250;
    private readonly Z_INDEX = '1';
    private readonly DRAW_LINE = 'round';
    private readonly CURSOR_TYPE = 'crosshair';
    private readonly LINE_WIDTH = 2;

    constructor() {
        super();
        // Init class properties
        this.borderColor = Colors.red;

        // Create canvas object ans set style for it
        this.canvas = document.createElement('canvas');
        this.canvas.style.zIndex = this.Z_INDEX;
        this.canvas.style.cursor = this.CURSOR_TYPE;
        this.canvas.style.position = this.CANVAS_POSITION;
        this.cCtx = this.canvas.getContext('2d');
    }

    public initDraw(cWidth: string, cHeight: string, bColor: string) {
        this.borderColor = bColor || Colors.red;
        
        // Init canvas properties
        this.canvas.width = parseInt(cWidth) || this.CANVAS_WIDTH;
        this.canvas.height = parseInt(cHeight) || this.CANVAS_HEIGHT;

        this.cCtx = this.canvas.getContext('2d');

        this.shadowRoot?.appendChild(this.canvas);
        // Init x,y after append to document.
        this.canvasY = this.canvas.getBoundingClientRect().top;
        this.canvasX = this.canvas.getBoundingClientRect().left;

        this.appendEvents();

        this.mouseDown = false;
    }
    
    public onDrawStart(e: MouseEvent) {
        this.lastMouseX = e.clientX - this.canvasX;
        this.lastMouseY = e.clientY - this.canvasY;
        this.mouseDown = true;
    }

    public onDraw(e: MouseEvent) {
        this.mouseX = e.clientX - this.canvasX;
        this.mouseY = e.clientY - this.canvasY;
        if (this.mouseDown) {
            const points = this.getStartEndIPoints();
            this.drawLine(points.start, points.end);
        }
    }

    public drawLine(start: IPoint, end: IPoint) {
        this.cCtx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cCtx?.beginPath();
        // Start to draw
        this.cCtx?.moveTo(start.x, start.y);
        this.cCtx?.lineTo(end.x, end.y);
        if (this.cCtx) {
            this.cCtx.strokeStyle = this.borderColor;
            this.cCtx.lineWidth = this.LINE_WIDTH;
            this.cCtx.lineJoin = <CanvasLineJoin>this.DRAW_LINE;
            this.cCtx.lineCap = <CanvasLineCap>this.DRAW_LINE;
        }
        this.cCtx?.stroke();
    }

    public onDrawComplete() {
        this.mouseDown = false;
        // Trigger event to parent component.
        // Output: IDrawCompleteEvent
        this.$emit('drawer', this.getStartEndIPoints());
    }

    // To-do: Responsive and scroll event to handle
    public onCanvasSizeChange() {

    }

    private getStartEndIPoints(): IDrawPoint {
        const start: IPoint = {
            x: this.lastMouseX,
            y: this.lastMouseY
        };
        const end: IPoint = {
            x: this.mouseX,
            y: this.mouseY
        };
        return { start, end };
    }

    private appendEvents() {
        this.canvas.addEventListener('mousedown', this.onDrawStart.bind(this));
        this.canvas.addEventListener('mousemove', this.onDraw.bind(this));
        this.canvas.addEventListener('mouseup', this.onDrawComplete.bind(this));
    }

}