import { attr, customElement, FASTElement, observable } from '@microsoft/fast-element';
import { IDictionary } from '../../../common/services/localization/localization.definitions';
import { DatePickerEvent, IAllowedDates, IDatePickerRenderEvent } from './date-picker.definitions';
import { styles } from './date-picker.style';
import { template } from './date-picker.template';
import { DatePicker } from './pickadate/Jquery.DatePicker';
import { Localization } from './../../../common/services/localization/localization.class';
const PickaDate = require('../../../scripts/PickaDate.script');

/* eslint-disable @typescript-eslint/no-unused-expressions */
PickaDate;
Localization;

/**
 * Date picker component
 * @public
 */
@customElement({
    name: 'media-date-picker',
    template,
    styles
})
export class DatePickerComponent extends FASTElement {
    /**
     * When true, align date picker to the right side of the opener button
     *
     * @public
     * @remarks
     * HTML attribute: alignRight
     */
    @attr public alignRight = false;
    /**
     * Enable UI attribute, when true date picker is shown
     *
     * @public
     * @remarks
     * HTML attribute: enableUI
     */
    @attr public enableUI = false;

    /**
     * Reflects the current selected date
     *
     * @public
     * @remarks
     * HTML attribute: enableUI
     */
    @attr public date: Date = new Date();

    /**
     * Reflects a new input date
     *
     * @public
     * @remarks
     * HTML attribute: inputDate
     */
    @attr public inputDate: string;

    @observable public resources: IDictionary = {};

    /**
     * Represents available dates - years months and days.
     *
     * @public
     * @remarks
     * HTML attribute: allowedYears
     */
    @observable public allowedDates: IAllowedDates = {
        days: '',
        months: '',
        years: ''
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private datePicker: any = null;

    // Loading sources
    private datePickerCSSLoaded = false;
    private uiConnected = false;

    public constructor() {
        super();
    }

    public allowedDatesChanged() {
        this.disableDates();
    }

    public inputDateChanged() {
        const dateObj = new Date(this.inputDate);
        if (dateObj.getTime() === this.date.getTime()) {
            return;
        }

        // Update date object and set the date picker
        this.date = dateObj;
        this.datePicker?.picker?.set('select', this.date);
    }

    public connectedCallback() {
        super.connectedCallback();
        this.uiConnected = true;

        this.createFabricDatePicker();

        this.createDatePicker();
    }

    public disconnectedCallback() {
        // Remove all elements
        this.shadowRoot.removeChild(this.shadowRoot.querySelector('#date-picker-css-link'));
    }

    public initLocalization() {
        this.setPickerDateJsLocalization();

        this.resources = Localization.dictionary;
        // Translate months
        const monthsElements = this.shadowRoot.querySelectorAll('.ms-DatePicker-monthOption.js-changeDate');
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let index = 0; index < monthsElements.length; index++) {
            const element = monthsElements[index];
            const month = parseInt(element?.getAttribute('data-month'), 10) + 1;
            const resourcePath = `DATE_PICKER_Month_${month}`;
            element.textContent = `${this.resources[resourcePath]}`;
        }
    }

    private createFabricDatePicker() {
        const datePickerCSS = document.createElement('link');
        datePickerCSS.setAttribute('id', 'date-picker-css-link');
        datePickerCSS.setAttribute('rel', 'stylesheet');
        datePickerCSS.setAttribute(
            'href',
            'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.min.css'
        );

        datePickerCSS.onload = () => {
            this.datePickerCSSLoaded = true;
            this.createDatePicker();
        };

        this.shadowRoot.appendChild(datePickerCSS);
    }

    private createDatePicker() {
        // If all sources loaded - create fabric date picker
        if (!(this.uiConnected && this.datePickerCSSLoaded)) {
            return;
        }

        try {
            setTimeout(() => {
                const DatePickerElements = this.shadowRoot.querySelectorAll('.ms-DatePicker');
                this.datePicker = new DatePicker(DatePickerElements[0], {});

                this.setPickerDateJsLocalization();

                this.datePicker.picker.on('open', this.onDateOpen.bind(this));
                this.datePicker.picker.on('set', this.onDateChange.bind(this));
                this.datePicker.picker.on('render', this.onRenderDates.bind(this));

                // Show date picker only after initialization
                this.enableUI = true;

                if (!Object.keys(this.resources).length) {
                    this.resources = Localization.dictionary;
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    private setPickerDateJsLocalization() {
        if (this.datePicker?.picker?.component?.settings) {
            for (const key in this.datePicker.picker.component.settings) {
                if (typeof this.datePicker.picker.component.settings[key] === 'string') {
                    this.datePicker.picker.component.settings[key] =
                        Localization.resolve(`DATE_PICKER_${key}`) || this.datePicker.picker.component.settings[key];
                } else if (typeof this.datePicker.picker.component.settings[key] === 'object') {
                    // Loop in the object and translate
                    for (const k in this.datePicker.picker.component.settings[key]) {
                        this.datePicker.picker.component.settings[key][k] =
                            Localization.resolve(`DATE_PICKER_${key}_${k}`) || this.datePicker.picker.component.settings[key][k];
                    }
                }
            }
        }
    }

    private onRenderDates() {
        // When render new month / year, emit the selected ones.
        const eventData: IDatePickerRenderEvent = {
            month: this.datePicker.picker.component.item.view?.month,
            year: this.datePicker.picker.component.item.view?.year
        };
        this.$emit(DatePickerEvent.RENDER, eventData);
        this.disableDates();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private onDateChange(event: any) {
        if (event.select) {
            const newDate = new Date(event.select);
            if (this.date.getTime() !== newDate.getTime()) {
                this.date = newDate;
            }
            this.$emit(DatePickerEvent.DATE_CHANGE, this.date);
        }
    }

    private disableMonths() {
        // Take months according to available months list
        const monthsElements = this.shadowRoot.querySelectorAll('.ms-DatePicker-monthOption.js-changeDate');
        const months = this.allowedDates.months?.split(',') || '';
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let index = 0; index < monthsElements.length; index++) {
            const element = monthsElements[index];
            const month = parseInt(element?.getAttribute('data-month'), 10) + 1;
            if (!months?.includes(month.toString())) {
                element?.classList?.add('disabled');
            } else {
                element?.classList?.remove('disabled');
            }
        }
    }

    private disableYears() {
        // Take all days
        const yearsElements = this.shadowRoot.querySelectorAll('.ms-DatePicker-yearOption.js-changeDate');
        const years = this.allowedDates.years?.split(',') || '';
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let index = 0; index < yearsElements.length; index++) {
            const element = yearsElements[index];
            const year = parseInt(element?.getAttribute('data-year'), 10);
            if (!years?.includes(year.toString())) {
                element?.classList?.add('disabled');
            } else {
                element?.classList?.remove('disabled');
            }
        }
    }

    private disableDays() {
        // Take all days
        const daysElements = this.shadowRoot.querySelectorAll('.ms-DatePicker-day.ms-DatePicker-day--infocus');
        const days = this.allowedDates.days?.split(',') || '';
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let index = 0; index < daysElements.length; index++) {
            const element = daysElements[index];
            if (!days?.includes(element?.innerHTML)) {
                element?.classList?.add('disabled');
            } else {
                element?.classList?.remove('disabled');
            }
        }
    }

    private disableDates() {
        this.disableYears();
        this.disableMonths();
        this.disableDays();
    }

    private onDateOpen() {
        //This function will be called when clicking the datepicker icon to open the calendar.
    }
}
