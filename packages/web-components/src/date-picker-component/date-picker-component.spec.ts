import { html, fixture, expect } from '@open-wc/testing';

import { DatePickerComponent } from './date-picker-component';

DatePickerComponent;

describe('DatePickerComponent', () => {
    it('Select todays date"', async () => {
        const el = await fixture<DatePickerComponent>(html`<media-date-picker-component></media-date-picker-component>`);
        const currentDate = new Date();
        expect(el.date.toString()).to.equal(currentDate.toString());
    });

    it('Select input date"', async () => {
        const el = await fixture<DatePickerComponent>(html`<media-date-picker-component></media-date-picker-component>`);
        const inputDate = new Date('2021.2.2').toString();
        el.setAttribute('inputDate', inputDate);
        expect(el.date.toString()).to.equal(inputDate.toString());
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<DatePickerComponent>(html`<media-date-picker-component></media-date-picker-component>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
