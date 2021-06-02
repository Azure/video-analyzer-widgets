import { AvaDesignSystemProvider } from '../../../styles';
import { EditableTextFieldComponent } from './editable-text-field.component';
import { Localization } from './../../../common/services/localization/localization.class';

// Prevent tree-shaking
AvaDesignSystemProvider;
EditableTextFieldComponent;

interface ITemplate {
    darkTheme?: boolean;
    text?: string;
    editMode?: boolean;
}

const EditableTextFieldComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider');
    designSystem.setAttribute('use-defaults', '');
    designSystem.style.height = '400px';
    (designSystem as AvaDesignSystemProvider).theme = (data?.darkTheme && 'dark') || '';
    const editableTextField = document.createElement('media-editable-text-field') as EditableTextFieldComponent;
    editableTextField.text = data.text || '';
    editableTextField.editMode = data.editMode || false;
    designSystem.appendChild(editableTextField);
    return designSystem;
};

export const EditableTextField = (args: ITemplate) => EditableTextFieldComponentTemplate(args);

export default {
    title: Localization.dictionary.EDITABLE_TEXT_FIELD_ComponentTitle,
    argTypes: {
        darkTheme: { control: 'boolean', defaultValue: true },
        text: { control: 'text' },
        editMode: { control: 'boolean', defaultValue: false }
    }
};
