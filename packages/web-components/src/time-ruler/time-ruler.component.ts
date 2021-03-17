import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { closestElement } from '../../../common/utils/elements';
import { SegoeUIFontFamily } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { TimeRuler } from './time-ruler.class';
import { IRulerOptions } from './time-ruler.definitions';
import { styles } from './time-ruler.style';

/**
 * An Time Ruler for 24 hours
 * @public
 */
@customElement({
    name: 'media-time-ruler',
    styles
})
export class TimeRulerComponent extends FASTElement {
    /**
     * start date represent the ruler left bar start date, default is current day
     *
     * @public
     * @remarks
     * HTML attribute: start date
     */
    @attr public startDate: Date;

    /**
     * zoom
     *
     * @public
     * @remarks
     * HTML attribute: zoom
     */
    @attr public zoom: number = 1;

    private readonly DEFAULT_TEXT_COLOR = 'black';
    private readonly DEFAULT_SCALE_COLOR = 'gray';
    private ruler: TimeRuler;

    public startDateChanged() {
        setTimeout(() => {
            this.redrawRuler();
        });
    }

    public zoomChanged() {
        setTimeout(() => {
            this.redrawRuler();
        });
    }

    public connectedCallback() {
        super.connectedCallback();
        this.initRuler();
    }

    public initRuler() {
        const rulerOptions = this.getRulerOptions();
        this.ruler = new TimeRuler(rulerOptions);
        this.ruler.draw();
        this.$fastController.element.shadowRoot?.appendChild(this.ruler.canvas);

        window.addEventListener('resize', () => {
            this.redrawRuler();
        });

        closestElement('ava-design-system-provider', this)?.addEventListener('theme-changed', () => {
            this.redrawRuler();
        });
    }

    private redrawRuler() {
        const rulerOptions = this.getRulerOptions();
        this.ruler.rulerOptions = rulerOptions;
        this.ruler.draw();
    }

    private getRulerOptions(): IRulerOptions {
        // Ruler styles by design system or default
        const designSystem = closestElement('ava-design-system-provider', this);
        const smallScaleColor = designSystem
            ? getComputedStyle(designSystem)?.getPropertyValue('--ruler-small-scale-color')
            : this.DEFAULT_SCALE_COLOR;
        const textColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--ruler-text-color') : this.DEFAULT_TEXT_COLOR;
        const timeColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--ruler-time-color') : this.DEFAULT_TEXT_COLOR;
        const fontFamily = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--font-family') : SegoeUIFontFamily;

        return {
            height: 22,
            width: this.$fastController.element?.offsetWidth,
            fontFamily: fontFamily,
            fontSize: '12px',
            lineWidth: 1,
            zoom: this.zoom,
            fontColor: textColor,
            timeColor: timeColor,
            smallScaleColor: smallScaleColor,
            dateText:
                this.startDate?.toLocaleString('default', { month: 'long', day: 'numeric' }) ||
                new Date().toLocaleString('default', { month: 'long', day: 'numeric' })
        };
    }
}
