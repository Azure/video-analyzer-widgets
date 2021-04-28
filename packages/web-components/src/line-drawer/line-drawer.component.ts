import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { CursorTypes, DrawerEvents } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { DrawerCanvas } from './../../../common/drawer-canvas/drawer-canvas.class';
import { closestElement } from './../../../common/utils/elements';
import { styles } from './line-drawer.style';

/**
 * An line-drawer item.
 * @public
 */
@customElement({
    name: 'media-line-drawer',
    styles
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

    public dCanvas: DrawerCanvas;
    private readonly CANVAS_DEFAULT_HEIGHT = 375;
    private readonly CANVAS_DEFAULT_WIDTH = 250;
    private readonly CANVAS_POSITION = 'relative';
    private readonly CURSOR_TYPE = CursorTypes.CROSSHAIR;
    private readonly LINE_WIDTH = 2;

    private canvasOptions: ICanvasOptions;

    public borderColorChanged() {
        if (this.canvasOptions) {
            setTimeout(() => {
                this.canvasOptions.lineColor = this.borderColor;
                this.dCanvas.drawerOptions = this.canvasOptions;
                this.resetLineDrawer();
            });
        }
    }

    // Only after creation of the template, the canvas element is created and assigned to DOM
    public connectedCallback() {
        super.connectedCallback();

        setTimeout(() => {
            this.init();
        });
    }

    public resetLineDrawer() {
        this.dCanvas.resize();
    }

    public disconnectedCallback() {
        this.dCanvas.canvas.removeEventListener('mousemove', this.dCanvas.onMouseMove.bind(this.dCanvas));
        this.dCanvas.canvas.removeEventListener('mouseup', this.dCanvas.onDraw.bind(this.dCanvas));
        this.dCanvas.canvas.removeEventListener(DrawerEvents.COMPLETE, this.onDrawComplete.bind(this));
        window.removeEventListener('resize', this.resize);
    }

    private init() {
        const parent = this.$fastController.element.parentElement;
        const width = parent.clientWidth || this.CANVAS_DEFAULT_WIDTH;
        const height = parent.clientHeight || this.CANVAS_DEFAULT_HEIGHT;
        const designSystem = closestElement('ava-design-system-provider', this.$fastController.element);
        const borderColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--drawer-default-line-color') : '';
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
        this.dCanvas.canvas.addEventListener(DrawerEvents.COMPLETE, this.onDrawComplete.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
    }

    private resize() {
        const parent = this.$fastController.element.parentElement;
        const width = parent?.clientWidth || this.CANVAS_DEFAULT_WIDTH;
        const height = parent?.clientHeight || this.CANVAS_DEFAULT_HEIGHT;
        this.canvasOptions = {
            ...this.canvasOptions,
            height: height,
            width: width
        };

        this.dCanvas.drawerOptions = this.canvasOptions;
        this.dCanvas.initBoundingCanvas();
        this.dCanvas.resize();
    }

    private onDrawComplete() {
        this.$emit(DrawerEvents.COMPLETE, this.dCanvas.points);
        this.dCanvas.clearPoints();
    }
}
