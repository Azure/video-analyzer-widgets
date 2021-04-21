import { html, fixture, expect } from '@open-wc/testing';

import { EditableTextFieldComponent } from './editable-text-field.component';

EditableTextFieldComponent;

describe('EditableTextFieldComponent', () => {
    it('passes the a11y audit', async () => {
        const el = await fixture<EditableTextFieldComponent>(html`<media-editable-text-field></media-editable-text-field>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
