import { attr, customElement, FASTElement } from '@microsoft/fast-element';
// import { IArea, IAreasOptions } from './areas-view.definitions';
import { styles } from './areas-view.style';
import { AreasCanvas } from './areas-canvas.class';
import { IArea } from '../../../widgets/src/area-draw/area-draw.definitions';
import { IAreasOptions } from './areas-view.definitions';

/**
 * An area view.
 * @public
 */
@customElement({
    name: 'media-areas-view',
    styles
})
export class AreasViewComponent extends FASTElement {
    /**
     * Areas.
     *
     * @public
     * @remarks
     * HTML attribute: areas
     */
    @attr public areas: IArea[] = [];

    public areasCanvas: AreasCanvas;
    private readonly CANVAS_DEFAULT_HEIGHT = 375;
    private readonly CANVAS_DEFAULT_WIDTH = 250;
    private readonly CANVAS_POSITION = 'relative';
    private readonly LINE_WIDTH = 2;

    private areasOptions: IAreasOptions;

    public constructor() {
        super();
    }
    public areasChanged() {
        setTimeout(() => {
            this.initAreasOptions();
            this.areasCanvas.areasOptions = this.areasOptions;
            this.areasCanvas.resize();
        });
    }
    // Only after creation of the template, the canvas element is created and assigned to DOM
    public connectedCallback() {
        super.connectedCallback();

        this.init();
    }

    private init() {
        this.initAreasOptions();

        this.areasCanvas = new AreasCanvas(this.areasOptions);
        this.shadowRoot?.appendChild(this.areasCanvas.canvas);

        window.addEventListener('resize', () => {
            this.initAreasOptions();

            this.areasCanvas.areasOptions = this.areasOptions;
            this.areasCanvas.resize();
        });
    }

    private initAreasOptions() {
        const parent = this.$fastController.element.parentElement;
        const width = parent.clientWidth || this.CANVAS_DEFAULT_WIDTH;
        const height = parent.clientHeight || this.CANVAS_DEFAULT_HEIGHT;
        this.areasOptions = {
            height: height,
            width: width,
            position: this.CANVAS_POSITION,
            lineWidth: this.LINE_WIDTH,
            areas: this.areas
        };
    }
}
