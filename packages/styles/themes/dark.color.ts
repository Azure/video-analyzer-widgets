import { css, ElementStyles } from '@microsoft/fast-element';

export const darkColorsStyle: ElementStyles = css`
    :host {
        --font-family: 'Segoe UI';
        --neutral-foreground-rest: #ffffff;
        --background-color: #444444;
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
        --accent-fill-active: #216458;
        --accent-fill-hover: #2b8071;
        --accent-fill-rest: #277466;
        --accent-foreground-cut-rest: #ffffff;
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
        --neutral-fill-rest: #4d4d4d;
        --neutral-fill-hover: #545454;
        --neutral-fill-active: #484848;
        --neutral-focus-inner-accent: #16423a;
        --accent-foreground-hover: #90bdb4;
        --accent-foreground-active: #6da89d;
        --neutral-fill-stealth-rest: #3b3b3b;
        --neutral-fill-stealth-hover: #484848;
        --neutral-fill-stealth-active: #424242;
        --neutral-divider-rest: #4f4f4f;
        --neutral-layer-floating: #4a4a4a;
        --neutral-foreground-hint: #a7a7a7;

        /* Segments Line */
        --segments-progress-color: rgb(119 189 242);
        --segments-line-bg: #323130;
        --segments-color: #605e5c;
        --segments-tooltip: #323130;
        --segments-tooltip-text: #f7f7f7;
        --segments-active-color: white;

        /* Time Ruler */
        --ruler-small-scale-color: #8a8886;
        --ruler-text-color: #f3f2f1;
        --ruler-time-color: #c8c6c4;

        /* Layer Label */
        --layer-label-bg: rgba(17, 16, 15, 0.9);
        --layer-label-color: #f3f2f1;

        /* Actions Menu */
        --actions-menu-bg: rgba(17, 16, 15, 0.9);
        --actions-menu-color: #f3f2f1;
    }
`;
