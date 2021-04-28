import { BaseWidget } from '../base-widget';
import { customElement, attr } from '@microsoft/fast-element';

@customElement('rvx-widget')
export class RVXWidget extends BaseWidget {
    @attr public greeting: string = 'Hello RVX widget';

    public greetingChanged() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = this.greeting;
        }
    }

    public render(): void {
        throw new Error('Method not implemented.');
    }

    protected init(): void {
        throw new Error('Method not implemented.');
    }
}
