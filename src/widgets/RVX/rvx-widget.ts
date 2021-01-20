import { BaseWidget } from '../base';
import { customElement, attr } from '@microsoft/fast-element';

@customElement('rvx-widget')
export class RVXWidget extends BaseWidget {
  @attr public greeting: string = 'Hello RVX widget';

  public greetingChanged() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.greeting;
    }
  }
}
