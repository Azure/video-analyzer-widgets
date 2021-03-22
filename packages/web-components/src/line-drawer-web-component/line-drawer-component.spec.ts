import { html, fixture, expect } from '@open-wc/testing';

import { LineDrawerComponent } from './line-drawer-component';

LineDrawerComponent;

describe('LineDrawerComponent', () => {
    it('has a default text "this is example component"', async () => {
        const el = await fixture<LineDrawerComponent>(html`<line-drawer-component></line-drawer-component>`);

        expect(el.borderColor).to.equal('this is example component');
    });

    it('can override the text via attribute', async () => {
        const el = await fixture<LineDrawerComponent>(html`<line-drawer-component text="Hello"></line-drawer-component>`);

        expect(el).to.equal('Hello');
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<LineDrawerComponent>(html`<line-drawer-component></line-drawer-component>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
