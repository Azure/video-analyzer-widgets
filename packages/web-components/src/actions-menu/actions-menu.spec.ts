import { html, fixture, expect } from '@open-wc/testing';

import { ActionsMenuComponent } from './actions-menu.component';

ActionsMenuComponent;

describe('ActionsMenuComponent', () => {
    it('passes the a11y audit', async () => {
        const el = await fixture<ActionsMenuComponent>(html`<media-actions-menu></media-actions-menu>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
