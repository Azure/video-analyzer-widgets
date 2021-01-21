import { attr, customElement, FASTElement } from '@microsoft/fast-element';

@customElement({
    name: 'example-web-component'
})
export class ExampleComponent extends FASTElement {
    @attr public greeting: string = 'Hello RVX widget';

    public greetingChanged() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = this.greeting;
        }
    }
}
