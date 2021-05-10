import { css } from '@microsoft/fast-element';

export const secondaryAccentButtonStyle = css`
    :host > fast-button.secondary {
        --accent-fill-active: var(--secondary-fill-press);
        --accent-fill-hover: var(--secondary-fill-hover);
        --accent-fill-rest: var(--secondary-fill);
    }
`;

export const style = css`
    :host {
        display: block;
        font-display: swap;
        background: var(--background-color);
        color: var(--type-primary);
        font-family: var(--font-family);
        --body-font: var(--font-family);

        /* Fast Design System variables */
        --font-family: 'Segoe UI';
        --neutral-foreground-rest: var(--action);
        --background-color: var(--bg-primary);
        --density: 0;
        --design-unit: 4;
        --base-height-multiplier: 10;
        --base-horizontal-spacing-multiplier: 3;
        --corner-radius: 2;
        --outline-width: 2;
        --focus-outline-width: 2;
        --disabled-opacity: 0.3;
        --type-ramp-minus-2-font-size: 10px;
        --type-ramp-minus-2-line-height: 16px;
        --type-ramp-minus-1-font-size: 12px;
        --type-ramp-minus-1-line-height: 16px;
        --type-ramp-base-font-size: 14px;
        --type-ramp-base-line-height: 20px;
        --type-ramp-plus-1-font-size: 16px;
        --type-ramp-plus-1-line-height: 24px;
        --type-ramp-plus-2-font-size: 20px;
        --type-ramp-plus-2-line-height: 28px;
        --type-ramp-plus-3-font-size: 28px;
        --type-ramp-plus-3-line-height: 36px;
        --type-ramp-plus-4-font-size: 34px;
        --type-ramp-plus-4-line-height: 44px;
        --type-ramp-plus-5-font-size: 46px;
        --type-ramp-plus-5-line-height: 56px;
        --type-ramp-plus-6-font-size: 60px;
        --type-ramp-plus-6-line-height: 72px;
        --accent-fill-active: var(--primary-hover);
        --accent-fill-hover: var(--primary-press);
        --accent-fill-rest: var(--primary);
        --accent-foreground-cut-rest: var(--primary-type);
        --neutral-fill-input-active: #3b3b3b;
        --neutral-fill-input-hover: #3b3b3b;
        --neutral-fill-input-rest: #3b3b3b;
        --neutral-focus: #909090;
        --neutral-outline-active: #646464;
        --neutral-outline-hover: #a2a2a2;
        --neutral-outline-rest: #7b7b7b;
        --neutral-foreground-active: #ffffff;
        --neutral-foreground-hover: #ffffff;
        --accent-foreground-rest: #7bb0a6;
        --neutral-fill-rest: transparent;
        --neutral-fill-hover: #545454;
        --neutral-fill-active: #484848;
        --neutral-focus-inner-accent: #16423a;
        --accent-foreground-hover: #90bdb4;
        --accent-foreground-active: #6da89d;
        --neutral-fill-stealth-rest: transparent;
        --neutral-fill-stealth-hover: var(--secondary-fill-hover);
        --neutral-fill-stealth-active: var(--secondary-fill-press);
        --neutral-divider-rest: #4f4f4f;
        --neutral-layer-floating: #4a4a4a;
        --neutral-foreground-hint: #a7a7a7;

        /* Segments Line */
        --segments-progress-color: rgb(119 189 242);
        --segments-line-bg: var(--segment-bg);
        --segments-color: var(--segment-rest);
        --segments-tooltip: var(--segment-bg);
        --segments-tooltip-text: var(--type-primary);
        --segments-active-color: var(--segment-selected);

        /* Time Ruler */
        --ruler-small-scale-color: var(--ruler-line-alt);
        --ruler-text-color: var(--type-primary);
        --ruler-time-color: var(--type-secondary);

        /* Date picker */
        --date-picker-holder-bg: var(--bg-menu);
        --date-picker-button-bg: var(--bg-controls);
        --date-picker-text-color: var(--action);
        --date-picker-tittle-color: var(--type-primary);

        --date-picker-today-bg: var(--primary);
        --date-picker-today-color: var(--primary-type);

        --date-picker-selected-hover: var(--action-fill-hover);
        --date-picker-selected-press: var(--action-fill-press);

        --date-picker-disabled-color: var(--type-disabled-alt);

        --date-picker-divider-color: var(--divider-alt);
        --date-picker-holder-box-shadow-1: rgba(0, 0, 0, 0.1);
        --date-picker-holder-box-shadow-2: rgba(0, 0, 0, 0.13);

        /* Layer Label */
        --layer-label-bg: var(--overlay);
        --layer-label-color: var(--type-primary);

        /* Actions Menu */
        --actions-menu-bg: var(--bg-menu);
        --actions-menu-color: var(--type-primary);

        /* Drawer Canvas */
        --drawer-line-color: #db4646;
        --drawer-fill-color: rgba(219, 70, 70, 0.4);

        /* Zone Draw */
        --zone-draw-color: var(--type-tertiary);
        --zone-draw-bg: var(--bg-dialog);
    }
`;
