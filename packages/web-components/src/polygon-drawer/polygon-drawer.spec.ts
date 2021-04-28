import { html, fixture, expect } from '@open-wc/testing';
import { PolygonDrawerComponent } from './polygon-drawer.component';

PolygonDrawerComponent;

describe('PolygonDrawerComponent', () => {

    it('render polygon drawer - with default values', async () => {
        // Set value as the default
        const borderColor = '#DB4646';
        const fillColor = 'rgba(219, 70, 70, 0.4)';
        const el = await fixture<PolygonDrawerComponent>(html`<media-polygon-drawer></media-polygon-drawer>`);
        el.borderColor = borderColor;
        el.fillColor = fillColor;
        setTimeout(() => {
            expect(el.borderColor).to.equal('#DB4646');
            expect(el.fillColor).to.equal('rgba(219, 70, 70, 0.4)');
        });
    });

    it('render polygon drawer - with predefined values', async () => {
        const el = await fixture<PolygonDrawerComponent>(html`<media-polygon-drawer borderColor="#4D9DFF" fillColor="#4D9DF1"></media-polygon-drawer>`);

        expect(el.borderColor).to.equal('#4D9DFF');
        expect(el.fillColor).to.equal('#4D9DF1');
    });

});
