import { html, fixture, expect } from '@open-wc/testing';

import { PlayerComponent } from './rvx-player';

PlayerComponent;

describe('player', () => {
    // it('has a default text "this is example component"', async () => {
    //     const el = await fixture<PlayerComponent>(html`<rvx-player></rvx-player>`);

    //     expect(el.text).to.equal('this is example component');
    // });

    // it('can override the text via attribute', async () => {
    //     const el = await fixture<PlayerComponent>(html`<rvx-player text="Hello"></rvx-player>`);

    //     expect(el.text).to.equal('Hello');
    // });

    it('passes the a11y audit', async () => {
        const el = await fixture<PlayerComponent>(html`<rvx-player></rvx-player>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
