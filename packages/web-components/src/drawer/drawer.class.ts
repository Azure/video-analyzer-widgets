import { FASTElement } from '@microsoft/fast-element';
import { Colors } from './colors.definitions';
import { DEFAULT_CANVAS_HEIGHT } from './drawer.definitions';

/**
 * The class handles:
 * 1. Creating canvas element and heat-map area by getting the boundaries of the areas as input
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

    constructor() {
        super();
        // Init class properties
        this.borderColor = Colors.red;

        // Create canvas object ans set style for it
        this.canvas = document.createElement('canvas');
        this.canvas.style.zIndex = '1';
        this.canvas.style.cursor = 'crosshair';
        this.canvas.style.position = 'relative';
        this.cCtx = this.canvas.getContext('2d');
    }

    public initDraw(cWidth: string, cHeight: string, bColor: string) {
        // Init canvas properties
        this.canvasY = 0;
        this.canvasX = 0;
        this.borderColor = bColor || Colors.red;

        this.canvas.width = parseInt(cWidth) || 100;
        this.canvas.height = parseInt(cHeight) || DEFAULT_CANVAS_HEIGHT;

        this.cCtx = this.canvas.getContext('2d');

        this.shadowRoot?.appendChild(this.canvas);
        this.appendEvents();

        this.mouseDown = false;
    }

    public onDrawStart() {
        this.mouseDown = false;
    }

    public onDraw(e: MouseEvent) {
        this.mouseX = e.clientX - this.canvasX;
        this.mouseY = e.clientY - this.canvasY;
        if (this.mouseDown) {
            this.cCtx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.cCtx?.beginPath();
            this.cCtx?.moveTo(this.lastMouseX, this.lastMouseY);
            this.cCtx?.lineTo(this.mouseX, this.mouseY);
            if (this.cCtx) {
                this.cCtx.strokeStyle = this.borderColor;
                this.cCtx.lineWidth = 2;
                this.cCtx.lineJoin = 'round';
                this.cCtx.lineCap = 'round';
            }
            this.cCtx?.stroke();
        }
    }

    public onDrawComplete(e: MouseEvent) {
        this.lastMouseX = e.clientX - this.canvasX;
        this.lastMouseY = e.clientY - this.canvasY;
        this.mouseDown = true;
        // Trigger event

    }

    // To-do: Responsive 
    public onCanvasSizeChange() {

    }

    private appendEvents() {
        this.canvas.addEventListener('mouseup', this.onDrawStart.bind(this));
        this.canvas.addEventListener('mousemove', this.onDraw.bind(this));
        this.canvas.addEventListener('mousedown', this.onDrawComplete.bind(this));
    }

}