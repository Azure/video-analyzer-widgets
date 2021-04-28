import { html, fixture, expect } from '@open-wc/testing';

import { LineDrawerComponent } from './line-drawer.component';

LineDrawerComponent;

describe('LineDrawerComponent', () => {
    it('render line drawer - with default values', async () => {
        // Set value as the default
        const borderColor = '#DB4646';
        const el = await fixture<LineDrawerComponent>(html`<media-line-drawer></media-line-drawer>`);
        el.borderColor = borderColor;
        expect(el.borderColor).to.equal('#DB4646');
    });

    it('render line drawer - with predefined values', async () => {
        const el = await fixture<LineDrawerComponent>(html`<media-line-drawer borderColor="#4D9DFF"></media-line-drawer>`);

        expect(el.borderColor).to.equal('#4D9DFF');
    });
});
