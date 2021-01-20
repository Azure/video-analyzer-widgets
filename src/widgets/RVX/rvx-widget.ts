import { BaseWidget } from "../base";
import { customElement, attr } from '@microsoft/fast-element';

@customElement('rvx-widget')
export class RVXWidget extends BaseWidget {
  @attr greeting: string = 'Hello RVX widget';

  greetingChanged() {
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
