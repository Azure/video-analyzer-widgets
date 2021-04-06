import { html, fixture, expect } from '@open-wc/testing';

import { LayerLabelComponent } from './layer-label.component';

LayerLabelComponent;

describe('LayerLabelComponent', () => {
    it('passes the a11y audit', async () => {
        const el = await fixture<LayerLabelComponent>(html`<media-layer-label></media-layer-label>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
