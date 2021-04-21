import { Locale } from './locale.definitions';

/**
 * Represents widget base configuration
 * @public
 */
export interface IWidgetBaseConfig {
    /**
     * Locale language
     */
    locale?: Locale;
    /**
     * Widget width
     */
    width?: string;
    /**
     * Widget height
     */
    height?: string;
}
