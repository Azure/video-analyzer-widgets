import { FASTDesignSystemProvider } from '@microsoft/fast-components';
import { defineDesignSystemProvider, designSystemProperty, DesignSystemProviderTemplate as template } from '@microsoft/fast-foundation';
import { darkColorsStyle, defaultColorsStyle } from '../themes';
import { style } from './ava-design-system-provider.style';

/**
 * AVA design system provider
 * @public
 */
@defineDesignSystemProvider({
    name: 'ava-design-system-provider',
    template: template,
    styles: [style]
})
export class AvaDesignSystemProvider extends FASTDesignSystemProvider {
    /**
     * Define design system property theme attribute
     */
    @designSystemProperty({
        attribute: 'theme',
        default: 'default'
    })
    public theme: string = '';
    protected themeChanged(): void {
        // If theme changes or is removed, we need to
        // re-evaluate whether we should have paint styles applied
        if (this.theme !== 'dark') {
            this.$fastController.removeStyles(darkColorsStyle);
            this.$fastController.addStyles(defaultColorsStyle);
        } else {
            this.$fastController.removeStyles(defaultColorsStyle);
            this.$fastController.addStyles(darkColorsStyle);
        }
    }
}
