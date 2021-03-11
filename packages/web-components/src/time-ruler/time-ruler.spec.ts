import { html, fixture, expect } from '@open-wc/testing';

import { TimeRulerComponent } from './time-ruler.component';

TimeRulerComponent;

describe('TimeRulerComponent', () => {
    it('passes the a11y audit', async () => {
        const el = await fixture<TimeRulerComponent>(html`<media-time-ruler></media-time-ruler>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
