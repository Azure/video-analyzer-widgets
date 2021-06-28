import { html, fixture, expect } from '@open-wc/testing';
import { TimelineComponent } from './timeline.component';
import { ITimeLineConfig } from './timeline.definitions';

TimelineComponent;

const segments = [
    { startSeconds: 0, endSeconds: 3600 },
    { startSeconds: 4500, endSeconds: 5000, color: 'red' },
    { startSeconds: 20000, endSeconds: 30000 },
    { startSeconds: 55000, endSeconds: 57000, color: 'blue' },
    { startSeconds: 60600, endSeconds: 64200 },
    { startSeconds: 80000, endSeconds: 81000, color: 'blue' }
];

const config: ITimeLineConfig = {
    segments: segments,
    date: new Date(),
    disableZoom: true
};

describe('TimelineComponent', () => {
    it('passes the a11y audit', async () => {
        const el = await fixture<TimelineComponent>(html`<media-timeline></media-timeline>`);
        el.config = config;
        el.configChanged();
        await expect(el).shadowDom.to.be.accessible();
    });

    it('without zoom - should have 2 children', async () => {
        const el = await fixture<TimelineComponent>(html`<media-timeline></media-timeline>`);
        el.config = config;
        el.configChanged();
        const isFirefoxBrowser = navigator.userAgent.includes('Firefox');
        // styles count as element on FF
        const childLength = isFirefoxBrowser ? 5 : 2;

        await expect(el.shadowRoot.children.length).to.equal(childLength);
    });

    xit('with zoom - should have 4 children', async () => {
        const el = await fixture<TimelineComponent>(html`<media-timeline></media-timeline>`);
        config.disableZoom = false;
        el.config = config;
        el.configChanged();

        // styles count as element on FF, but we removing the slider on FF so both need to be 4
        await expect(el.shadowRoot.children.length).to.equal(4);
    });
});
