import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { ActionsMenuComponent } from '../actions-menu';
import { EditableTextFieldComponent } from '../editable-text-field/editable-text-field.component';
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
    @attr
    public config: ILayerLabelConfig;

    @attr({ attribute: 'edit-mode', mode: 'boolean' })
    public editMode: boolean = false;

    public configChanged() {
        if (this.config?.mode === LayerLabelMode.Actions && this.config.actions?.length) {
            setTimeout(() => {
                this.setActions();
            });
        }
    }

    public editModeChanged() {
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
        const actionsMenu = <ActionsMenuComponent>this.shadowRoot?.querySelector('media-actions-menu');
        if (actionsMenu) {
            actionsMenu.actions = this.config.actions;
        }
        actionsMenu.addEventListener('actionClicked', (e: any) => {
            console.log(e);
            this.$emit('labelActionClicked', { ...e.detail, id: this.config.id });
            actionsMenu.opened = false;
        });

        if (this.editMode) {
            const editableTextField = <EditableTextFieldComponent>this.shadowRoot?.querySelector('media-editable-text-field');
            editableTextField?.addEventListener('textChanged', (e: any) => {
                console.log('text-changed');
                console.log(e);
                this.$emit('labelTextChanged', { name: e.detail, id: this.config.id });
                this.editMode = false;
            });
        }
    }
}
