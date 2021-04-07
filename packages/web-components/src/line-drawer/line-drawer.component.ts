import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { DrawerCanvas } from './../../../common/drawer-canvas/drawer-canvas.class';
import { closestElement } from './../../../common/utils/elements';

/**
 * An line-drawer item.
 * @public
 */
@customElement({
    name: 'line-drawer'
})
export class LineDrawerComponent extends FASTElement {

    /**
     * Drawing line color.
     *
     * @public
     * @remarks
     * HTML attribute: borderColor
    */
    @attr public borderColor: string = '';

    /**
    * The width of the canvas required to create.
    *
    * @public
    * @remarks
    * HTML attribute: canvasWidth
    */
    @attr public canvasWidth: string = '';

    /**
    * The height of the canvas required to create.
    *
    * @public
    * @remarks
    * HTML attribute: canvasHeight
    */
    @attr public canvasHeight: string = '';

    public dCanvas: DrawerCanvas;
    private readonly CANVAS_DEFAULT_HEIGHT = 375;
    private readonly CANVAS_DEFAULT_WIDTH = 250;
    private readonly CANVAS_POSITION = 'relative';
    private readonly CURSOR_TYPE = 'crosshair';
    private readonly LINE_WIDTH = 2;

    private canvasOptions: ICanvasOptions;

    public constructor() {
        super();
    }

    // Only after creation of the template, the canvas element is created and assigned to DOM
    public connectedCallback() {
        super.connectedCallback();

        this.init();
    }

    private init() {
        const width = parseInt(this.canvasWidth, 10) || this.CANVAS_DEFAULT_WIDTH;
        const height = parseInt(this.canvasHeight, 10) || this.CANVAS_DEFAULT_HEIGHT;
        const designSystem = closestElement('line-drawer', this.$fastController.element);
        const borderColor = designSystem
            ? getComputedStyle(designSystem)?.getPropertyValue('--drawer-line-color') : '';
        this.canvasOptions = {
            height: height,
            width: width,
            cursor: this.CURSOR_TYPE,
            position: this.CANVAS_POSITION,
            lineWidth: this.LINE_WIDTH,
            lineColor: this.borderColor || borderColor
        };

        this.dCanvas = new DrawerCanvas(this.canvasOptions);
        // Set canvas size
        this.dCanvas.setCanvas(this.canvasOptions.width, this.canvasOptions.height, 2);
        // Append to DOM
        this.shadowRoot?.appendChild(this.dCanvas.canvas);
        // Init props after appending to DOM
        this.dCanvas.initBoundingCanvas();
        // Handle mouse events
        this.appendEvents();
    }

    private appendEvents() {
        this.dCanvas.canvas.addEventListener('mousemove', this.dCanvas.onMouseMove.bind(this.dCanvas));
        this.dCanvas.canvas.addEventListener('mouseup', this.dCanvas.onDraw.bind(this.dCanvas));
        this.dCanvas.canvas.addEventListener('drawerComplete', this.onDrawComplete.bind(this));
    }

    private onDrawComplete() {
        this.$emit('drawerComplete', this.dCanvas.points);
    }

}
