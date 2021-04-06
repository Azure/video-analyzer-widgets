import { html } from '@microsoft/fast-element';
import { DatePickerComponent } from './date-picker-component';

/**
 * The template for the example component.
 * @public
 */
export const template = html<DatePickerComponent>`
    <template>
        <div class="ms-DatePicker ${(x) => (x.enableUI ? 'show' : 'hide')}">
            <div class="ms-TextField">
                <fast-button class="ms-TextField-field">
                    <svg width="32" height="32" viewBox="0 0 32 32">
                        <path
                            d="M3.359 10h4.641v2h-8v-8h2v4.281c0.708-1.281 1.563-2.432 2.563-3.453 0.99-1.021 2.094-1.885 3.313-2.594 1.208-0.719 2.5-1.271 3.875-1.656s2.792-0.578 4.25-0.578c1.479 0 2.901 0.193 4.266 0.578 1.354 0.375 2.625 0.911 3.813 1.609 1.187 0.688 2.271 1.521 3.25 2.5 0.969 0.969 1.802 2.047 2.5 3.234 0.687 1.188 1.224 2.464 1.609 3.828 0.375 1.365 0.562 2.781 0.562 4.25 0 1.479-0.188 2.901-0.562 4.266-0.386 1.354-0.922 2.625-1.609 3.813-0.698 1.187-1.531 2.271-2.5 3.25-0.979 0.969-2.063 1.802-3.25 2.5-1.188 0.687-2.464 1.224-3.828 1.609-1.365 0.375-2.781 0.562-4.25 0.562-1.792 0-3.51-0.286-5.156-0.859-1.656-0.573-3.161-1.375-4.516-2.406-1.365-1.042-2.542-2.281-3.531-3.719-1-1.437-1.734-3.021-2.203-4.75l1.922-0.531c0.417 1.51 1.063 2.896 1.938 4.156 0.865 1.25 1.891 2.328 3.078 3.234s2.505 1.615 3.953 2.125c1.448 0.5 2.953 0.75 4.516 0.75 1.292 0 2.531-0.167 3.719-0.5s2.302-0.802 3.344-1.406c1.031-0.615 1.974-1.349 2.828-2.203s1.589-1.797 2.203-2.828c0.604-1.042 1.073-2.156 1.406-3.344 0.333-1.198 0.5-2.438 0.5-3.719s-0.167-2.516-0.5-3.703c-0.333-1.198-0.802-2.313-1.406-3.344-0.615-1.042-1.349-1.99-2.203-2.844s-1.797-1.583-2.828-2.188c-1.042-0.615-2.156-1.089-3.344-1.422-1.198-0.333-2.438-0.5-3.719-0.5-1.344 0-2.651 0.188-3.922 0.563s-2.453 0.911-3.547 1.609c-1.104 0.698-2.094 1.542-2.969 2.531-0.885 0.979-1.62 2.078-2.203 3.297z"
                        ></path>
                        <path d="M16 8v8.578l5.703 5.719-1.406 1.406-6.297-6.281v-9.422h2z"></path>
                    </svg>
                </fast-button>
            </div>
            <div class="ms-DatePicker-monthComponents">
                <span class="ms-DatePicker-nextMonth js-nextMonth"><i class="ms-Icon i-arrow-page-down"></i></span>
                <span class="ms-DatePicker-prevMonth js-prevMonth"><i class="ms-Icon i-arrow-page-up"></i></span>
                <div class="ms-DatePicker-headerToggleView js-showMonthPicker"></div>
            </div>
            <span class="ms-DatePicker-goToday js-goToday">Go to today</span>
            <div class="ms-DatePicker-monthPicker">
                <div class="ms-DatePicker-header">
                    <div class="ms-DatePicker-yearComponents">
                        <span class="ms-DatePicker-nextYear js-nextYear"><i class="ms-Icon i-arrow-page-down"></i></span>
                        <span class="ms-DatePicker-prevYear js-prevYear"><i class="ms-Icon i-arrow-page-up"></i></span>
                    </div>
                    <div class="ms-DatePicker-currentYear js-showYearPicker"></div>
                </div>
                <div class="ms-DatePicker-optionGrid">
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="0">Jan</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="1">Feb</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="2">Mar</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="3">Apr</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="4">May</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="5">Jun</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="6">Jul</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="7">Aug</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="8">Sep</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="9">Oct</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="10">Nov</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="11">Dec</span>
                </div>
            </div>
            <div class="ms-DatePicker-yearPicker">
                <div class="ms-DatePicker-decadeComponents">
                    <span class="ms-DatePicker-nextDecade js-nextDecade"><i class="ms-Icon ms-Icon--ChevronRight"></i></span>
                    <span class="ms-DatePicker-prevDecade js-prevDecade"><i class="ms-Icon ms-Icon--ChevronLeft"></i></span>
                </div>
            </div>
        </div>
    </template>
`;
