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

    .ms-DatePicker-monthOption,
    .ms-DatePicker-yearOption {
        background-color: var(--date-picker-holder-bg);
        color: var(--date-picker-text-color);
        font-size: var(--type-ramp-minus-1-font-size);
    }

    .ms-DatePicker-monthOption.is-highlighted,
    .ms-DatePicker-yearOption.is-highlighted {
        background-color: var(--date-picker-bg-today);
        color: var(--date-picker-text-color-today);
    }

    .ms-DatePicker-holder {
        top: 9px;
    }

    .ms-Icon {
        font-family: 'avarvx-arrow';
    }

    .ms-Icon.i-arrow-page-up:before {
        content: '\\e74a';
        font-size: var(--type-ramp-minus-1-font-size);
        color: var(--date-picker-text-color);
    }
    .ms-Icon.i-arrow-page-down:before {
        content: '\\e74b';
        font-size: var(--type-ramp-minus-1-font-size);
        color: var(--date-picker-text-color);
    }

    .ms-DatePicker-day--selected {
        color: var(--date-picker-text-color-today); !important;
    }

    .ms-DatePicker-yearOption.js-changeDate.disabled,
    .ms-DatePicker-monthOption.js-changeDate.disabled,
    .ms-DatePicker-day.ms-DatePicker-day--infocus.disabled,
    .ms-DatePicker-day.ms-DatePicker-day--outfocus {
        pointer-events: none;
        cursor: not-allowed;
        color: var(--date-picker-focus-text-color-hover);
    }
`;
