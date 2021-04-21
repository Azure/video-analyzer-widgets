import { html, when } from '@microsoft/fast-element';
import { OK_SVG_PATH } from '../../../styles/svg/svg.shapes';
import { EditableTextFieldComponent } from './editable-text-field.component';

/**
 * The template for the actions menu component.
 * @public
 */
/* eslint-disable  @typescript-eslint/indent */
export const template = html<EditableTextFieldComponent>`
    <template>
        ${when(
            (x) => x.editMode,
            html`
                <div class="edit-container">
                    <input type="text" value="${(x) => x.text}" />
                    <fast-button
                        ?disabled="${(x) => !x.isDirty}"
                        aria-label="Approve"
                        title="Approve"
                        @click="${(x) => x.approveChanges()}"
                    >
                        <svg>
                            <path d="${OK_SVG_PATH}"></path>
                        </svg>
                    </fast-button>
                </div>
            `
        )}
        ${when((x) => !x.editMode, html`<span aria-label="${(x) => x.text}" title="${(x) => x.text}">${(x) => x.text}</span>`)}
    </template>
`;
