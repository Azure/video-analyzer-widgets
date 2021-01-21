import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { styles } from './example-web-component.style';
import { template } from './example-web-component.template';

/**
 * An example web component item.
 * @public
 */
@customElement({
    name: 'example-web-component',
    template,
    styles
})
export class ExampleComponent extends FASTElement {
    /**
     * The text of the item.
     *
     * @public
     * @remarks
     * HTML attribute: text
     */
    @attr public text: string = 'this is example component';

    /**
     * @internal
     */
    public textChanged() {
        // eslint-disable-next-line no-console
        console.log('Text changed');
    }
}
