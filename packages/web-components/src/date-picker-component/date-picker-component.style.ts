import { css } from '@microsoft/fast-element';
import { stylesFabric } from './date-picker-fabric.style';

export const styles = css`
    :host {
        display: inline-block;
    }

    ${stylesFabric}

    .ms-DatePicker {
        display: none;
        margin: 0;
    }

    .ms-DatePicker-day {
        border-radius: 50%;
    }

    .ms-TextField,
    .ms-DatePicker.show {
        display: block;
        font-family: var(--font-family);
        font-weight: 400;
    }

    .ms-DatePicker.right .ms-DatePicker-holder {
        right: 0;
    }

    .ms-DatePicker-monthOption,
    .ms-DatePicker-yearOption {
        background-color: #252423;
        font-size: 12px;
        color: #f3f2f1;
    }

    .ms-DatePicker-monthOption.is-highlighted,
    .ms-DatePicker-yearOption.is-highlighted {
        background-color: #2899f5;
        color: #1b1a19;
    }

    .ms-DatePicker-holder {
        top: 9px;
    }

    .ms-Icon {
        font-family: 'avarvx-arrow';
    }

    .ms-Icon.i-arrow-page-up:before {
        content: '\\e74a';
        font-size: 12px;
        color: #f3f2f1;
    }
    .ms-Icon.i-arrow-page-down:before {
        content: '\\e74b';
        font-size: 12px;
        color: #f3f2f1;
    }

    .ms-DatePicker-day--selected {
        color: #1b1a19 !important;
    }

    .ms-DatePicker-yearOption.js-changeDate.disabled,
    .ms-DatePicker-monthOption.js-changeDate.disabled,
    .ms-DatePicker-day.ms-DatePicker-day--infocus.disabled,
    .ms-DatePicker-day.ms-DatePicker-day--outfocus {
        pointer-events: none;
        cursor: not-allowed;
        color: #605e5c;
    }
`;
