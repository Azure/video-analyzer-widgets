import { html, fixture, expect } from '@open-wc/testing';

import { DatePickerComponent } from './date-picker-component';

DatePickerComponent;

describe('DatePickerComponent', () => {
    it('Select todays date"', async () => {
        const el = await fixture<DatePickerComponent>(html`<date-picker-component></date-picker-component>`);
        const currentDate = new Date();
        expect(el.date).to.equal(currentDate);
    });

    it('Select input date"', async () => {
        const el = await fixture<DatePickerComponent>(html`<date-picker-component></date-picker-component>`);
        const inputDate = new Date('2021.2.2').toDateString();
        el.setAttribute('inputDate', inputDate);
        expect(el.date).to.equal(inputDate);
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<DatePickerComponent>(html`<date-picker-component></date-picker-component>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
