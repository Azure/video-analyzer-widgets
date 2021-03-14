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

    private readonly DEFAULT_TEXT_COLOR = 'black';
    private readonly DEFAULT_SCALE_COLOR = 'gray';
    private ruler: TimeRuler;

    public dateChanged() {
        setTimeout(() => {
            const options = this.getRulerOptions();
            this.ruler.setOptions(options);
            this.ruler.drawRuler(this.$fastController.element?.getBoundingClientRect()?.width, options.rulerHeight);
        });
    }

    public connectedCallback() {
        super.connectedCallback();
        this.initRuler();
    }

    public initRuler() {
        let rulerOptions = this.getRulerOptions();
        const canvas = document.createElement('canvas');
        this.ruler = new TimeRuler(canvas, rulerOptions);
        this.ruler.drawRuler(this.$fastController.element?.getBoundingClientRect()?.width, rulerOptions.rulerHeight);
        this.$fastController.element.shadowRoot?.appendChild(canvas);

        window.addEventListener('resize', () => {
            this.ruler.drawRuler(this.$fastController.element?.getBoundingClientRect()?.width, rulerOptions.rulerHeight);
        });

        closestElement('ava-design-system-provider', this)?.addEventListener('theme-changed', () => {
            rulerOptions = this.getRulerOptions();
            this.ruler.setOptions(rulerOptions);
            this.ruler.drawRuler(this.$fastController.element?.getBoundingClientRect()?.width, rulerOptions.rulerHeight);
        });
    }

    private getRulerOptions(): IRulerOptions {
        // Ruler styles by design system or default
        const designSystem =
            closestElement('ava-design-system-provider', this) || window.document.querySelector('ava-design-system-provider');
        const smallScaleColor = designSystem
            ? getComputedStyle(designSystem)?.getPropertyValue('--ruler-small-scale')
            : this.DEFAULT_SCALE_COLOR;
        const textColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--ruler-text') : this.DEFAULT_TEXT_COLOR;
        const fontFamily = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--font-family') : SegoeUIFontFamily;

        return {
            rulerHeight: 22,
            fontFamily: fontFamily,
            fontSize: '12px',
            lineWidth: 1,
            textColor: textColor,
            smallScaleColor: smallScaleColor,
            dateText:
                this.startDate?.toLocaleString('default', { month: 'long', day: 'numeric' }) ||
                new Date().toLocaleString('default', { month: 'long', day: 'numeric' })
        };
    }
}
