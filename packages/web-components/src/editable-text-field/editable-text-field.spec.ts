import { html, fixture, expect } from '@open-wc/testing';

import { EditableTextFieldComponent } from './editable-text-field.component';

EditableTextFieldComponent;

describe('EditableTextFieldComponent', () => {
    it('passes the a11y audit', async () => {
        const el = await fixture<EditableTextFieldComponent>(html`<media-editable-text-field></media-editable-text-field>`);

        await expect(el).shadowDom.to.be.accessible();
    });

    it('passes text property', async () => {
        const el = await fixture<EditableTextFieldComponent>(html`<media-editable-text-field text="text"></media-editable-text-field>`);

        await expect(el.text).to.equal('text');
    });

    it('passes the text in the slot', async () => {
        const el = await fixture<EditableTextFieldComponent>(html`<media-editable-text-field>text</media-editable-text-field>`);

        setTimeout(() => {
            expect(el.text).to.equal('text');
        });
    });

    it('edit mode true - input should initialize', async () => {
        const el = await fixture<EditableTextFieldComponent>(html`<media-editable-text-field edit-mode>text</media-editable-text-field>`);

        await expect(el.shadowRoot.querySelector('input')).to.not.equal(null);
    });

    it('edit mode false - input should be null', async () => {
        const el = await fixture<EditableTextFieldComponent>(html`<media-editable-text-field>text</media-editable-text-field>`);

        await expect(el.shadowRoot.querySelector('input')).to.equal(null);
    });
});
