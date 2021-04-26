import { attr, customElement, FASTElement, observable } from '@microsoft/fast-element';
import { EditableTextFieldEvents } from './editable-text-field.definitions';
import { styles } from './editable-text-field.style';
import { template } from './editable-text-field.template';

/**
 * An editable text field.
 * @public
 */
@customElement({
    name: 'media-editable-text-field',
    template,
    styles
})
export class EditableTextFieldComponent extends FASTElement {
    /**
     * The text field text
     *
     * @public
     * @remarks
     * HTML attribute: text
     */
    @attr public text: string = '';

    /**
     * The text field edit mode (boolean).
     *
     * @public
     * @remarks
     * HTML attribute: editMode
     */

    @attr({ attribute: 'edit-mode', mode: 'boolean' })
    public editMode: boolean = false;

    @observable
    public isDirty = false;

    private input: HTMLInputElement;

    public editModeChanged() {
        if (this.editMode) {
            this.isDirty = false;
            setTimeout(() => {
                this.initTextField();
            });
        }
    }

    public connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            const textContent = this.$fastController.element.textContent;
            if (textContent) {
                this.text = textContent;
            }
        });
        this.initTextField();
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.input?.removeEventListener('input', this.handleValueChanged);
    }

    public approveChanges() {
        if (!this.input) {
            return;
        }
        this.text = this.input.value;
        this.$emit(EditableTextFieldEvents.TextChanged, this.text);
        this.editMode = false;
    }

    public handleFocusOut(event: FocusEvent) {
        if (!event.relatedTarget || !this.shadowRoot.contains(<Node>event.relatedTarget)) {
            if (this.input) {
                this.input.value = this.text;
            }
            this.editMode = false;
        }
    }

    private initTextField() {
        if (this.input) {
            return;
        }
        this.input = this.shadowRoot.querySelector('input');
        this.input?.addEventListener('input', this.handleValueChanged.bind(this));
    }

    private handleValueChanged() {
        this.isDirty = this.text !== this.input.value;
    }
}
