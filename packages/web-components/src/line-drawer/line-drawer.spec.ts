import { html, fixture, expect } from '@open-wc/testing';

import { LineDrawerComponent } from './line-drawer.component';

LineDrawerComponent;

describe('LineDrawerComponent', () => {
    it('has a default text "this is example component"', async () => {
        const el = await fixture<LineDrawerComponent>(html`<line-drawer></line-drawer>`);

        expect(el.borderColor).to.equal('this is example component');
    });

    it('can override the text via attribute', async () => {
        const el = await fixture<LineDrawerComponent>(html`<line-drawer text="Hello"></line-drawer>`);

        expect(el).to.equal('Hello');
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<LineDrawerComponent>(html`<line-drawer></line-drawer>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
