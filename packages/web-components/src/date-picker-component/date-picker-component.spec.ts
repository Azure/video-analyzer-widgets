import { html, fixture, expect } from '@open-wc/testing';

import { DatePickerComponent } from './date-picker-component';

DatePickerComponent;

describe('DatePickerComponent', () => {
    it('Select todays date"', async () => {
        const el = await fixture<DatePickerComponent>(html`<media-date-picker></media-date-picker>`);
        const currentDate = new Date();
        expect(el.date.getFullYear().toString()).to.equal(currentDate.getFullYear().toString());
        expect(el.date.getMonth().toString()).to.equal(currentDate.getMonth().toString());
        expect(el.date.getDate().toString()).to.equal(currentDate.getDate().toString());
    });

    it('Select input date"', async () => {
        const el = await fixture<DatePickerComponent>(html`<media-date-picker></media-date-picker>`);
        const inputDate = new Date('2021.2.2').toString();
        el.setAttribute('inputDate', inputDate);
        expect(el.date.toString()).to.equal(inputDate.toString());
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<DatePickerComponent>(html`<media-date-picker></media-date-picker>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
