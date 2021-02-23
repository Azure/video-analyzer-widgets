import { DesignSystemDefaults, FluentDesignSystemProvider } from '@fluentui/web-components';
import { FASTDesignSystemProvider } from '@microsoft/fast-components';
import { attr, css } from '@microsoft/fast-element';
import {
    defineDesignSystemProvider,
    designSystemProperty,
    DesignSystemProviderTemplate as template,
    display,
    forcedColorsStylesheetBehavior
} from '@microsoft/fast-foundation';
import { lightColorsStyle, darkColorsStyle } from '../themes';
FASTDesignSystemProvider;

export const style = css`
    :host {
        display: block;
        justify-content: center;
        font-display: swap;
        --body-font: 'Segoe UI';
    }

    [class^='active'] {
        content: '';
        display: block;
        height: calc(var(--outline-width) * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }
`;

/**
 * An example web component item.
 * @public
 */
@defineDesignSystemProvider({
    name: 'ava-design-system-provider',
    template,
    styles: [style]
})
export default class AvaDesignSystemProvider extends FASTDesignSystemProvider {
    /**
     * Define design system property attributes
     */
    @designSystemProperty({
        attribute: 'theme',
        default: 'light'
    })
    public theme: string = '';
    protected themeChanged(): void {
        // If background changes or is removed, we need to
        // re-evaluate whether we should have paint styles applied
        if (this.theme !== 'dark') {
            // this.$fastController.removeStyles(darkColorsStyle);
            this.$fastController.addStyles(lightColorsStyle);
        } else {
            // this.$fastController.removeStyles(lightColorsStyle);
            this.$fastController.addStyles(darkColorsStyle);
        }
    }
}
