import { html, fixture, expect, waitUntil } from '@open-wc/testing';
import { RENAME_SVG_PATH, DELETE_SVG_PATH } from '../../../styles/svg/svg.shapes';
import { DrawingColors } from '../../../styles/system-providers/ava-design-system-provider.definitions';

import { LayerLabelComponent } from './layer-label.component';
import { LayerLabelMode } from './layer-label.definitions';

LayerLabelComponent;

describe('LayerLabelComponent', () => {
    const config = {
        id: 'id',
        label: 'label',
        mode: LayerLabelMode.Compact,
        labelPrefix: 'labelPrefix',
        color: DrawingColors.Blue,
        actions: [
            {
                label: 'Rename',
                svgPath: RENAME_SVG_PATH
            },
            {
                label: 'Delete',
                svgPath: DELETE_SVG_PATH
            }
        ]
    };
    it('passes the a11y audit', async () => {
        const el = await fixture<LayerLabelComponent>(html`<media-layer-label></media-layer-label>`);

        await expect(el).shadowDom.to.be.accessible();
    });

    it('compact mode', async () => {
        const el = await fixture<LayerLabelComponent>(html`<media-layer-label></media-layer-label>`);
        config.mode = LayerLabelMode.Compact;
        el.config = config;
        const isFirefoxBrowser = navigator.userAgent.includes('Firefox');
        // styles count as element on FF
        const childLength = isFirefoxBrowser ? 2 : 1;
        await waitUntil(() => el.shadowRoot.childElementCount >= childLength, 'Element did not render children');

        // should equal 1 - only text span
        expect(el.shadowRoot.childElementCount).to.equal(childLength);
    });

    it('expanded mode', async () => {
        const el = await fixture<LayerLabelComponent>(html`<media-layer-label></media-layer-label>`);
        config.mode = LayerLabelMode.Expanded;
        el.config = config;
        const isFirefoxBrowser = navigator.userAgent.includes('Firefox');
        // styles count as element on FF
        const childLength = isFirefoxBrowser ? 3 : 2;
        await waitUntil(() => el.shadowRoot.childElementCount >= childLength, 'Element did not render children');

        // should equal 2 - color container and label span
        expect(el.shadowRoot.childElementCount).to.equal(childLength);
    });

    it('actions mode', async () => {
        const el = await fixture<LayerLabelComponent>(html`<media-layer-label></media-layer-label>`);
        config.mode = LayerLabelMode.Actions;
        el.config = config;
        const isFirefoxBrowser = navigator.userAgent.includes('Firefox');
        // styles count as element on FF
        const childLength = isFirefoxBrowser ? 4 : 3;
        await waitUntil(() => el.shadowRoot.childElementCount >= childLength, 'Element did not render children');

        // should equal 3 - color container, label span and actions menu
        expect(el.shadowRoot.childElementCount).to.equal(childLength);
    });
});
