/* import { html, fixture, expect } from '@open-wc/testing';

import { ExampleComponent } from './example-web-component.js';

ExampleComponent;

describe('ExampleComponent', () => {
    it('has a default text "this is example component"', async () => {
        const el = await fixture<ExampleComponent>(html`<example-web-component></example-web-component>`);

        expect(el.text).to.equal('this is example component');
    });

    it('can override the text via attribute', async () => {
        const el = await fixture<ExampleComponent>(html`<example-web-component text="Hello"></example-web-component>`);

        expect(el.text).to.equal('Hello');
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<ExampleComponent>(html`<example-web-component></example-web-component>`);

        await expect(el).shadowDom.to.be.accessible();
    });
}); */
