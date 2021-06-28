import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { styles } from './zones-view.style';
import { ZonesCanvas } from './zones-canvas.class';
import { IZonesOptions } from './zones-view.definitions';
import { IZone } from '../../../widgets/src/zone-drawer/zone-drawer.definitions';

/**
 * An zones view.
 * @public
 */
@customElement({
    name: 'media-zones-view',
    styles
})
export class ZonesViewComponent extends FASTElement {
    /**
     * Zones array to show on canvas.
     *
     * @public
     * @remarks
     * HTML attribute: zones
     */
    @attr public zones: IZone[] = [];

    public zonesCanvas: ZonesCanvas;
    private readonly CANVAS_DEFAULT_HEIGHT = 375;
    private readonly CANVAS_DEFAULT_WIDTH = 250;
    private readonly CANVAS_POSITION = 'relative';
    private readonly LINE_WIDTH = 2;

    private zonesOptions: IZonesOptions;
    private resizeObserver: ResizeObserver;

    public constructor() {
        super();
    }

    public zonesChanged() {
        setTimeout(() => {
            this.initZonesOptions();
            if (this.zonesCanvas) {
                this.zonesCanvas.zonesOptions = this.zonesOptions;
                this.zonesCanvas.resize();
            }
        });
    }

    public connectedCallback() {
        super.connectedCallback();

        const parent = this.$fastController?.element?.parentElement;
        this.resizeObserver = new ResizeObserver(() =>
            window.requestAnimationFrame(() => {
                this.resize();
            })
        );
        this.resizeObserver.observe(parent);
        this.init();
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        if (this.zonesCanvas) {
            this.shadowRoot.removeChild(this.zonesCanvas.canvas);
            this.zonesCanvas = null;
        }

        this.resizeObserver.disconnect();
    }

    private init() {
        this.initZonesOptions();

        this.zonesCanvas = new ZonesCanvas(this.zonesOptions);
        this.shadowRoot?.appendChild(this.zonesCanvas.canvas);
    }

    private resize() {
        this.initZonesOptions();

        if (this.zonesCanvas) {
            this.zonesCanvas.zonesOptions = this.zonesOptions;
            this.zonesCanvas.resize();
        }
    }

    private initZonesOptions() {
        const parent = this.$fastController.element.parentElement;
        const width = parent?.clientWidth || this.CANVAS_DEFAULT_WIDTH;
        const height = parent?.clientHeight || this.CANVAS_DEFAULT_HEIGHT;
        this.zonesOptions = {
            height: height,
            width: width,
            position: this.CANVAS_POSITION,
            lineWidth: this.LINE_WIDTH,
            zones: this.zones
        };
    }
}
