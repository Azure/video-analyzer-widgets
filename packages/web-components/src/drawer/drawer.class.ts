import { FASTElement } from '@microsoft/fast-element';
import { Colors } from './colors.definitions';
import { DrawerInitializedValues } from './drawer.definitions';

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

    constructor() {
        super();
        // Init class properties
        this.borderColor = Colors.red;

        // Create canvas object ans set style for it
        this.canvas = document.createElement('canvas');
        this.canvas.style.zIndex = DrawerInitializedValues.zIndex;
        this.canvas.style.cursor = DrawerInitializedValues.cursorType;
        this.canvas.style.position = DrawerInitializedValues.canvasPosition;
        this.cCtx = this.canvas.getContext('2d');
    }

    public initDraw(cWidth: string, cHeight: string, bColor: string) {
        this.canvasY = this.getBoundingClientRect().top;
        this.canvasX = this.getBoundingClientRect().left;
        this.borderColor = bColor || Colors.red;
        
        // Init canvas properties
        this.canvas.width = parseInt(cWidth) || DrawerInitializedValues.canvasWidth;
        this.canvas.height = parseInt(cHeight) || DrawerInitializedValues.canvasHeight;

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
                this.cCtx.lineJoin = <CanvasLineJoin>DrawerInitializedValues.drawLineRound;
                this.cCtx.lineCap = <CanvasLineCap>DrawerInitializedValues.drawLineRound;
            }
            this.cCtx?.stroke();
        }
    }

    public onDrawComplete(e: MouseEvent) {
        this.lastMouseX = e.clientX - this.canvasX;
        this.lastMouseY = e.clientY - this.canvasY;
        this.mouseDown = true;
        // Trigger event to parent component
        this.$emit('drawer', [this.lastMouseX, this.lastMouseY]);
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