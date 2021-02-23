import { FASTDesignSystemProvider } from '@microsoft/fast-components';
import { html, fixture, expect } from '@open-wc/testing';

import AvaDesignSystemProvider from './ava.system-provider';

AvaDesignSystemProvider;
FASTDesignSystemProvider;

describe('AvaDesignSystemProvider', () => {
    it('has a default theme - light', async () => {
        const el = await fixture<AvaDesignSystemProvider>(html`<ava-design-system-provider></ava-design-system-provider>`);

        expect(el.backgroundColor).to.equal('#f7f7f7');
    });

    it('can override the theme via attribute - dark', async () => {
        const el = await fixture<AvaDesignSystemProvider>(html`<ava-design-system-provider theme="dark"></ava-design-system-provider>`);

        expect(el.backgroundColor).to.equal('#3b3b3b');
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<AvaDesignSystemProvider>(html`<ava-design-system-provider></ava-design-system-provider>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
