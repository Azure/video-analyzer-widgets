import { FASTButton } from '@microsoft/fast-components';
import { attr, customElement, FASTElement, observable } from '@microsoft/fast-element';
import { Button } from '@microsoft/fast-foundation';
import { styles } from './ava-button.style';
import { template } from './ava-button.template';
// import { FASTButton } from '@microsoft/fast-components';
// import { customElement } from '@microsoft/fast-element';
// import { ButtonTemplate as template } from '@microsoft/fast-foundation';
// import { ButtonStyles as styles } from '@microsoft/fast-components';
import { FASTDesignSystemProvider } from '@microsoft/fast-components';
import { AvaButtonPrimaryDesignSystemProvider } from '../../system-provider/ava-button-primary.system-provider';
import { FluentDesignSystemProvider, FluentCard, FluentButton } from '@fluentui/web-components';

FASTDesignSystemProvider;
AvaButtonPrimaryDesignSystemProvider;
FluentDesignSystemProvider;

/**
 * An example web component item.
 * @public
 */
@customElement({
    name: 'ava-button',
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true
    }
})
export class AVAButton extends Button {
    /**
     * The text of the item.
     *
     * @public
     * @remarks
     * HTML attribute: text
     */
    @attr public text: string = 'this is example component';

    /**
     * The text of the item.
     *
     * @public
     * @remarks
     * HTML attribute: text
     */
    @attr public actionType: IActionType = IActionType.Primary;

    /**
     * @internal
     */
    public textChanged() {
        // eslint-disable-next-line no-console
        console.log('Text changed');
    }

    /**
     * @internal
     */
    public buttonClick() {
        // eslint-disable-next-line no-console
        console.log('Text changed');
    }

    @observable provider!: any;
    providerChanged() {
        // eslint-disable-next-line no-console
        console.log(this.provider);
        // this.provider.registerCSSCustomProperty(neutralLayerL1Behavior);
        // this.provider.style.setProperty('background-color', `var(--${neutralLayerL1Behavior.name})`);
        // this.provider.backgroundColor = (neutralLayerL1Behavior.value as any)(this.provider.designSystem);
        // this.provider.baseLayerLuminance = 1;
    }

    connectedCallback() {
        super.connectedCallback();
        this.provider = this.parentElement;
    }
}

export enum IActionType {
    Primary = 'primary',
    Secondary = 'secondary'
}
