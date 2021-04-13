import { customElement, FASTElement, attr } from '@microsoft/fast-element';
import { ICanvasOptions } from '../../../common/canvas/canvas.definitions';
import { DrawerCanvas } from './../../../common/drawer-canvas/drawer-canvas.class';
import { closestElement } from './../../../common/utils/elements';

/**
 * A polygon-drawer component.
 * @public
 */
@customElement({
    name: 'media-polygon-drawer'
})
export class PolygonDrawerComponent extends FASTElement {

    /**
     * Drawing line color.
     *
     * @public
     * @remarks
     * HTML attribute: borderColor
     */
    @attr public borderColor: string = '';
    borderColorChanged() {
        setTimeout(() => {
            this.dCanvas.drawerOptions.lineColor = this.borderColor;

            this.resetLineDrawer();
        });
    }

    /**
     * Drawing fill polygon color.
     *
     * @public
     * @remarks
     * HTML attribute: fillColor
     */
    @attr public fillColor: string = '';
    fillColorChanged() {
        setTimeout(() => {
            this.dCanvas.drawerOptions.fillStyle = this.fillColor;

            this.resetLineDrawer();
        });
    }

    public dCanvas: DrawerCanvas;

    private readonly CANVAS_DEFAULT_HEIGHT = 375;
    private readonly CANVAS_DEFAULT_WIDTH = 250;
    private readonly CANVAS_POSITION = 'relative';
    private readonly CURSOR_TYPE = 'crosshair';
    private readonly LINE_WIDTH = 2;

    public constructor() {
        super();
    }

    // Only after creation of the template, the canvas element is created and assigned to DOM
    public connectedCallback() {
        super.connectedCallback();

        this.init();
    }

    public resetLineDrawer() {
        this.dCanvas.resize();
    }

    private init() {
        const parent = this.$fastController.element.parentElement;
        const width = parent.clientWidth || this.CANVAS_DEFAULT_WIDTH;
        const height = parent.clientHeight || this.CANVAS_DEFAULT_HEIGHT;
        const designSystem = closestElement('ava-design-system-provider', this.$fastController.element);
        const borderColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--drawer-line-color') : '';
        const fillColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--drawer-fill-color') : '';
        const drawerOptions: ICanvasOptions = {
            height: height,
            width: width,
            cursor: this.CURSOR_TYPE,
            position: this.CANVAS_POSITION,
            lineWidth: this.LINE_WIDTH,
            lineColor: this.borderColor || borderColor,
            fillStyle: this.fillColor || fillColor
        };

        this.dCanvas = new DrawerCanvas(drawerOptions);
        // Set canvas size
        this.dCanvas.setCanvas(drawerOptions.width, drawerOptions.height, 10);
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

        window.addEventListener('resize', () => {
            const parent = this.$fastController.element.parentElement;
            const width = parent?.clientWidth || this.CANVAS_DEFAULT_WIDTH;
            const height = parent?.clientHeight || this.CANVAS_DEFAULT_HEIGHT;
            this.dCanvas.drawerOptions = {
                ...this.dCanvas.drawerOptions,
                height: height,
                width: width
            };

            this.dCanvas.initBoundingCanvas();
            this.dCanvas.resize();
        });
    }

    private onDrawComplete() {
        console.log('complete');
        this.$emit('drawerComplete', this.dCanvas?.points);
        this.dCanvas.clearPoints();
    }
}
