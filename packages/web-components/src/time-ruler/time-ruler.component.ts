import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { closestElement } from '../../../common/utils/elements';
import { AvaDesignSystemProvider } from '../../../styles';
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
     * date represent the ruler left bar start date
     *
     * @public
     * @remarks
     * HTML attribute: date
     */
    @attr public date: Date = new Date();

    private readonly DEFAULT_TEXT_COLOR = 'black';
    private readonly DEFAULT_SCALE_COLOR = 'gray';
    private ruler: TimeRuler;

    public connectedCallback() {
        super.connectedCallback();
        this.initRuler();
    }

    public initRuler() {
        let options = this.getRulerOptions();
        const canvas = document.createElement('canvas');
        this.ruler = new TimeRuler(canvas, options);
        this.ruler.drawRuler(this.$fastController.element?.getBoundingClientRect()?.width, options.rulerHeight);
        this.$fastController.element.shadowRoot?.appendChild(canvas);

        window.addEventListener('resize', () => {
            this.ruler.drawRuler(this.$fastController.element?.getBoundingClientRect()?.width, options.rulerHeight);
        });

        closestElement('ava-design-system-provider', this)?.addEventListener('theme-changed', () => {
            options = this.getRulerOptions();
            this.ruler.setOptions(options);
            this.ruler.drawRuler(this.$fastController.element?.getBoundingClientRect()?.width, options.rulerHeight);
        });
    }

    private getRulerOptions(): IRulerOptions {
        const designSystem: AvaDesignSystemProvider =
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
            dateText: this.date?.toLocaleString('default', { month: 'long', day: 'numeric' })
        };
    }
}
