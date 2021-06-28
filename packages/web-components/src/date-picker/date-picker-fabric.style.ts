import { css } from '@microsoft/fast-element';

export const datePickerStyleFabric = css`
    .ms-DatePicker {
        -webkit-font-smoothing: antialiased;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        box-shadow: none;
        margin-bottom: 17px;
        z-index: 300;
    }

    .ms-DatePicker .ms-TextField {
        position: relative;
    }

    .ms-DatePicker-picker {
        font-size: var(--type-ramp-base-font-size);
        position: relative;
        text-align: left;
        z-index: 0;
    }

    .ms-DatePicker-holder {
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        position: absolute;
        min-width: 300px;
        display: none;
        background-color: var(--date-picker-holder-bg);
    }

    .ms-DatePicker-picker.ms-DatePicker-picker--opened .ms-DatePicker-holder {
        animation-name: fadeIn, slideDownIn10;
        -webkit-animation-duration: 0.167s;
        -moz-animation-duration: 0.167s;
        -ms-animation-duration: 0.167s;
        -o-animation-duration: 0.167s;
        animation-timing-function: cubic-bezier(0.1, 0.25, 0.75, 0.9);
        animation-fill-mode: both;
        box-sizing: border-box;
        box-shadow: 0px 1.2px 3.6px var(--date-picker-holder-box-shadow-1), 0px 6.4px 14.4px var(--date-picker-holder-box-shadow-2);
        display: block;
    }

    .ms-DatePicker-picker--opened {
        position: relative;
        z-index: 10;
    }

    .ms-DatePicker-frame {
        padding: 1px;
    }

    .ms-DatePicker-wrap {
        margin: -1px;
        padding: 9px;
    }

    .ms-DatePicker-dayPicker {
        display: block;
        margin-bottom: 30px;
    }

    .ms-DatePicker-header {
        height: 40px;
        line-height: 44px;
    }

    .ms-DatePicker-month,
    .ms-DatePicker-year {
        display: inline-block;
        margin-top: -1px;

        font-weight: 600;
        font-size: var(--type-ramp-base-font-size);
        color: var(--date-picker-text-color);
    }

    .ms-DatePicker-month {
        pointer-events: none;
    }

    .ms-DatePicker-month:hover,
    .ms-DatePicker-year:hover {
        cursor: pointer;
    }

    .ms-DatePicker-month {
        margin-left: 15px;
    }

    .ms-DatePicker-year {
        margin-left: 5px;
    }

    .ms-DatePicker-table {
        text-align: center;
        border-collapse: collapse;
        border-spacing: 0;
        table-layout: fixed;
        font-size: inherit;
    }

    .ms-DatePicker-table td {
        margin: 0;
        padding: 0;
    }

    .ms-DatePicker-table td:hover {
        outline: 1px solid transparent;
    }

    .ms-DatePicker-day,
    .ms-DatePicker-weekday {
        width: 40px;
        height: 40px;
        padding: 0;
        font-weight: 400;
        line-height: 40px;
        font-size: var(--type-ramp-base-font-size);
    }

    .ms-DatePicker-day--today {
        position: relative;
        border-radius: 50% !important;
        background: var(--date-picker-today-bg) !important;
        color: var(--date-picker-today-color);
    }

    .ms-DatePicker-day--disabled:before {
        border-top-color: var(--date-picker-disabled-color);
    }

    .ms-DatePicker-day--outfocus {
        font-weight: 400;
    }

    .ms-DatePicker-weekday,
    .ms-DatePicker-day.ms-DatePicker-day--infocus {
        color: var(--date-picker-text-color);
    }

    .ms-DatePicker-day--infocus:hover,
    .ms-DatePicker-day--outfocus:hover {
        cursor: pointer;
        background: var(--date-picker-selected-hover);
        border-radius: 0;
    }

    .ms-DatePicker-day--highlighted:hover,
    .ms-DatePicker-picker--focused .ms-DatePicker-day--highlighted {
        cursor: pointer;
        border-radius: 0px;
        background: var(--date-picker-selected-press);
    }

    .ms-DatePicker-day--highlighted.ms-DatePicker-day--disabled,
    .ms-DatePicker-day--highlighted.ms-DatePicker-day--disabled:hover {
        background: none;
    }

    .ms-DatePicker-monthPicker,
    .ms-DatePicker-yearPicker {
        display: none;
    }

    .ms-DatePicker-monthComponents {
        position: absolute;
        top: 9px;
        right: 9px;
        left: 9px;
    }

    .ms-DatePicker-decadeComponents,
    .ms-DatePicker-yearComponents {
        position: absolute;
        right: 10px;
    }

    .ms-DatePicker-nextDecade,
    .ms-DatePicker-nextMonth,
    .ms-DatePicker-nextYear,
    .ms-DatePicker-prevDecade,
    .ms-DatePicker-prevMonth,
    .ms-DatePicker-prevYear {
        width: 40px;
        height: 40px;
        display: block;
        float: right;
        margin-left: 10px;
        text-align: center;
        line-height: 23px;
        font-size: 21px;
        color: var(--date-picker-text-color);
        position: relative;
        top: 3px;
    }

    .ms-DatePicker-nextDecade:hover,
    .ms-DatePicker-nextMonth:hover,
    .ms-DatePicker-nextYear:hover,
    .ms-DatePicker-prevDecade:hover,
    .ms-DatePicker-prevMonth:hover,
    .ms-DatePicker-prevYear:hover {
        color: var(--date-picker-text-color);
        cursor: pointer;
        outline: 1px solid transparent;
    }

    .ms-DatePicker-headerToggleView {
        height: 40px;
        left: 0;
        position: absolute;
        top: 0;
        width: 140px;
        z-index: 5;
        cursor: pointer;
    }

    .ms-DatePicker-currentDecade,
    .ms-DatePicker-currentYear {
        display: block;
        height: 40px;
        line-height: 42px;
        margin-left: 15px;

        font-weight: 600;
        font-size: var(--type-ramp-base-font-size);
        color: var(--date-picker-tittle-color);
    }

    .ms-DatePicker-currentYear:hover {
        color: var(--date-picker-text-color);
        cursor: pointer;
    }

    .ms-DatePicker-optionGrid {
        position: relative;
        height: 210px;
        width: 280px;
        margin: 10px 0 30px 5px;
    }

    .ms-DatePicker-monthOption,
    .ms-DatePicker-yearOption {
        background-color: var(--date-picker-holder-bg);
        width: 60px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        float: left;
        margin: 0 10px 10px 0;
        font-weight: 400;
        text-align: center;
    }

    .ms-DatePicker-monthOption:hover,
    .ms-DatePicker-yearOption:hover {
        background-color: var(--date-picker-selected-hover);
        outline: 1px solid transparent;
    }

    .ms-DatePicker-goToday {
        display: none;
        bottom: 9px;
        color: var(--date-picker-text-color);
        cursor: pointer;
        font-weight: 300;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        position: absolute;
        right: 9px;
    }

    .ms-DatePicker-goToday:hover {
        outline: 1px solid transparent;
        color: var(--date-picker-today-bg);
    }

    .ms-DatePicker-goToday:focus {
        outline: 1px solid var(--secondary-focus);
    }

    .ms-DatePicker.is-pickingYears .ms-DatePicker-dayPicker,
    .ms-DatePicker.is-pickingYears .ms-DatePicker-monthComponents,
    .ms-DatePicker.is-pickingYears .ms-DatePicker-monthPicker {
        display: none;
    }

    .ms-DatePicker.is-pickingYears .ms-DatePicker-yearPicker {
        display: block;
    }

    @media (min-width: 460px) {
        .ms-DatePicker-holder {
            width: 440px;
        }

        .ms-DatePicker-header {
            height: 30px;
            line-height: 28px;
        }

        .ms-DatePicker-dayPicker {
            box-sizing: border-box;
            border-right: 1px solid var(--date-picker-divider-color);
            width: 220px;
            margin: -10px 0;
            padding: 10px 0;
        }

        .ms-DatePicker-monthPicker {
            display: block;
        }

        .ms-DatePicker-monthPicker,
        .ms-DatePicker-yearPicker {
            top: 9px;
            left: 238px;
            position: absolute;
        }

        .ms-DatePicker-optionGrid {
            width: 200px;
            height: auto;
            margin: 10px 0 0;
        }

        .ms-DatePicker-monthComponents {
            width: 210px;
        }

        .ms-DatePicker-month {
            margin-left: 12px;
        }

        .ms-DatePicker-day,
        .ms-DatePicker-weekday {
            width: 30px;
            height: 30px;
            line-height: 30px;
            font-size: var(--type-ramp-base-font-size);
            font-weight: 400;
        }

        .ms-DatePicker-nextDecade,
        .ms-DatePicker-nextMonth,
        .ms-DatePicker-nextYear,
        .ms-DatePicker-prevDecade,
        .ms-DatePicker-prevMonth,
        .ms-DatePicker-prevYear {
            width: 30px;
            height: 30px;
        }

        .ms-DatePicker-toggleMonthView {
            display: none;
        }

        .ms-DatePicker-currentDecade,
        .ms-DatePicker-currentYear {
            margin: 0;
            height: 30px;
            line-height: 26px;
            padding: 0 10px;
            display: inline-block;
        }

        .ms-DatePicker-monthOption,
        .ms-DatePicker-yearOption {
            width: 40px;
            height: 40px;
            line-height: 40px;
            font-size: var(--type-ramp-minus-1-font-size);
            margin: 0 10px 10px 0;
        }

        .ms-DatePicker-monthOption:hover,
        .ms-DatePicker-yearOption:hover {
            outline: 1px solid transparent;
        }

        .ms-DatePicker-goToday {
            box-sizing: border-box;
            font-size: var(--type-ramp-minus-1-font-size);
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            right: 10px;
            text-align: right;
            top: 199px;
            width: 210px;
        }

        .ms-DatePicker.is-pickingYears .ms-DatePicker-dayPicker,
        .ms-DatePicker.is-pickingYears .ms-DatePicker-monthComponents {
            display: block;
        }

        .ms-DatePicker.is-pickingYears .ms-DatePicker-monthPicker {
            display: none;
        }

        .ms-DatePicker.is-pickingYears .ms-DatePicker-yearPicker {
            display: block;
        }
    }

    @media (max-width: 459px) {
        .ms-DatePicker.is-pickingMonths .ms-DatePicker-dayPicker,
        .ms-DatePicker.is-pickingMonths .ms-DatePicker-monthComponents {
            display: none;
        }

        .ms-DatePicker.is-pickingMonths .ms-DatePicker-monthPicker {
            display: block;
        }
    }
`;
