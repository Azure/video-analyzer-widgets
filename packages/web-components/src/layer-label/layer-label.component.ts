import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { ActionsMenuComponent } from '../actions-menu';
import { ActionsMenuEvents } from '../actions-menu/actions-menu.definitions';
import { EditableTextFieldComponent } from '../editable-text-field/editable-text-field.component';
import { EditableTextFieldEvents } from '../editable-text-field/editable-text-field.definitions';
import { ILayerLabelConfig, ILayerLabelOutputEvent, LayerLabelEvents, LayerLabelMode } from './layer-label.definitions';
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

    private actionsMenu: ActionsMenuComponent;
    private editableTextField: EditableTextFieldComponent;

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

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.actionsMenu?.removeEventListener(ActionsMenuEvents.ActionClicked, null);
        this.editableTextField?.removeEventListener(EditableTextFieldEvents.TextChanged, null);
    }

    private setActions() {
        this.actionsMenu = <ActionsMenuComponent>this.shadowRoot?.querySelector('media-actions-menu');
        if (this.actionsMenu) {
            this.actionsMenu.actions = this.config.actions;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.actionsMenu?.addEventListener(ActionsMenuEvents.ActionClicked, (e: any) => {
            this.$emit(LayerLabelEvents.labelActionClicked, { ...e.detail, id: this.config.id });
            this.actionsMenu.opened = false;
        });

        if (this.editMode) {
            this.editableTextField = <EditableTextFieldComponent>this.shadowRoot?.querySelector('media-editable-text-field');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.editableTextField?.addEventListener(EditableTextFieldEvents.TextChanged, (e: any) => {
                const output: ILayerLabelOutputEvent = { name: e.detail, id: this.config.id };
                this.$emit(LayerLabelEvents.labelTextChanged, output);
                this.editMode = false;
            });
        }
    }
}
