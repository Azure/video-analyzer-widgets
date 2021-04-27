import { html, fixture, expect, waitUntil } from '@open-wc/testing';
import { DELETE_SVG_PATH, RENAME_SVG_PATH } from '../../../styles/svg/svg.shapes';
import { ActionsMenuComponent } from './actions-menu.component';

ActionsMenuComponent;

describe('ActionsMenuComponent', () => {
    const actions = [
        {
            label: 'Rename',
            svgPath: RENAME_SVG_PATH
        },
        {
            label: 'Delete',
            svgPath: DELETE_SVG_PATH
        }
    ];

    it('passes the a11y audit', async () => {
        const el = await fixture<ActionsMenuComponent>(html`<media-actions-menu></media-actions-menu>`);

        await expect(el).shadowDom.to.be.accessible();
    });

    it('opened menu with 2 actions', async () => {
        const el = await fixture<ActionsMenuComponent>(html`<media-actions-menu></media-actions-menu>`);
        el.actions = actions;
        el.opened = true;

        await waitUntil(() => el.shadowRoot.querySelector('fast-menu') !== null, 'Element did not render children');
        // should equal 2 - for 2 actions
        expect(el.shadowRoot.querySelector('fast-menu').childElementCount).to.equal(2);
    });

    it('closed menu without fast-menu', async () => {
        const el = await fixture<ActionsMenuComponent>(html`<media-actions-menu></media-actions-menu>`);
        el.actions = actions;
        el.opened = false;

        expect(el.shadowRoot.querySelector('fast-menu')).to.equal(null);
    });
});
