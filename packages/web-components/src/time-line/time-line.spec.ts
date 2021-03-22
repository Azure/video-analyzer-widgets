import { html, fixture, expect } from '@open-wc/testing';
import { TimeLineComponent } from './time-line.component';
import { ITimeLineConfig } from './time-line.definitions';

TimeLineComponent;

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
    date: new Date()
};

describe('TimeLineComponent', () => {
    it('passes the a11y audit', async () => {
        const el = await fixture<TimeLineComponent>(html`<media-time-line></media-time-line>`);

        await expect(el).shadowDom.to.be.accessible();
    });

    it('without zoom - should have 2 children', async () => {
        const el = await fixture<TimeLineComponent>(html`<media-time-line></media-time-line>`);
        config.enableZoom = false;
        el.config = config;
        el.initData();
        const isFirefoxBrowser = navigator.userAgent.includes('Firefox');
        // styles count as element on FF
        const childLength = isFirefoxBrowser ? 3 : 2;

        await expect(el.shadowRoot.children.length).to.equal(childLength);
    });

    it('with zoom - should have 3 children', async () => {
        const el = await fixture<TimeLineComponent>(html`<media-time-line></media-time-line>`);
        config.enableZoom = true;
        el.config = config;
        el.initData();

        // styles count as element on FF, but we removing the slider on FF so both need to be 3
        await expect(el.shadowRoot.children.length).to.equal(3);
    });
});
