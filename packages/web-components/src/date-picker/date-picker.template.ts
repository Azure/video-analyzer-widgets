import { html } from '@microsoft/fast-element';
import { GO_TO_ARCHIVE_MAIN_SVG_PATH, GO_TO_ARCHIVE_SUB_SVG_PATH } from '../../../styles/svg/svg.shapes';
import { DatePickerComponent } from './date-picker.component';

/**
 * The template for the date picker component.
 * @public
 */
export const template = html<DatePickerComponent>`
    <template>
        <div class="ms-DatePicker ${(x) => (x.enableUI ? 'show' : 'hide')} ${(x) => (x.alignRight ? 'right' : '')}">
            <div class="ms-TextField">
                <fast-button class="ms-TextField-field" appearance="stealth">
                    <svg>
                        <path d="${GO_TO_ARCHIVE_MAIN_SVG_PATH}"></path>
                        <path d="${GO_TO_ARCHIVE_SUB_SVG_PATH}"></path>
                    </svg>
                </fast-button>
            </div>
            <div class="ms-DatePicker-monthComponents">
                <span class="ms-DatePicker-nextMonth js-nextMonth"><i class="ms-Icon i-arrow-page-down"></i></span>
                <span class="ms-DatePicker-prevMonth js-prevMonth"><i class="ms-Icon i-arrow-page-up"></i></span>
                <div class="ms-DatePicker-headerToggleView js-showMonthPicker"></div>
            </div>
            <span class="ms-DatePicker-goToday js-goToday">${(x) => (x.resources?.DATE_PICKER_GoToToday)}</span>
            <div class="ms-DatePicker-monthPicker">
                <div class="ms-DatePicker-header">
                    <div class="ms-DatePicker-yearComponents">
                        <span class="ms-DatePicker-nextYear js-nextYear"><i class="ms-Icon i-arrow-page-down"></i></span>
                        <span class="ms-DatePicker-prevYear js-prevYear"><i class="ms-Icon i-arrow-page-up"></i></span>
                    </div>
                    <div class="ms-DatePicker-currentYear js-showYearPicker"></div>
                </div>
                <div class="ms-DatePicker-optionGrid">
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="0">${(x) => (x.resources?.DATE_PICKER_Jan)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="1">${(x) => (x.resources?.DATE_PICKER_Feb)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="2">${(x) => (x.resources?.DATE_PICKER_Mar)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="3">${(x) => (x.resources?.DATE_PICKER_Apr)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="4">${(x) => (x.resources?.DATE_PICKER_May)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="5">${(x) => (x.resources?.DATE_PICKER_Jun)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="6">${(x) => (x.resources?.DATE_PICKER_Jul)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="7">${(x) => (x.resources?.DATE_PICKER_Aug)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="8">${(x) => (x.resources?.DATE_PICKER_Sep)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="9">${(x) => (x.resources?.DATE_PICKER_Oct)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="10">${(x) => (x.resources?.DATE_PICKER_Nov)}</span>
                    <span class="ms-DatePicker-monthOption js-changeDate" data-month="11">${(x) => (x.resources?.DATE_PICKER_Dec)}</span>
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
