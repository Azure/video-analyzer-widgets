import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { ActionsMenuComponent } from '../actions-menu';
import { ILayerLabelConfig, LayerLabelMode } from './layer-label.definitions';
import { styles } from './layer-label.style';
import { template } from './layer-label.template';

/**
 * An layer label web component.
 * @public
 */
@customElement({
    name: 'media-layer-label',
    template,
    styles
})
export class LayerLabelComponent extends FASTElement {
    /**
     * The config of the layer label.
     *
     * @public
     * @remarks
     * HTML attribute: config
     */
    @attr public config: ILayerLabelConfig;

    public configChanged() {
        if (this.config?.mode === LayerLabelMode.Actions && this.config.actions?.length) {
            setTimeout(() => {
                this.setActions();
            });
        }
    }

    public connectedCallback() {
        super.connectedCallback();
    }

    private setActions() {
        const actionsMenu = <ActionsMenuComponent>this.$fastController.element.shadowRoot.querySelector('media-actions-menu');
        if (actionsMenu) {
            actionsMenu.actions = this.config.actions;
        }
    }
}
