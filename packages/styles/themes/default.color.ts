import { css, ElementStyles } from '@microsoft/fast-element';

export const defaultColorsStyle: ElementStyles = css`
    :host {
        --font-family: 'Segoe UI';
        --neutral-foreground-rest: #262626;
        --background-color: #f7f7f7;
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
        --accent-fill-active: #3c8b7d;
        --accent-fill-hover: #277466;
        --accent-fill-rest: #2b8071;
        --accent-foreground-cut-rest: #ffffff;
        --neutral-fill-input-active: #f7f7f7;
        --neutral-fill-input-hover: #f7f7f7;
        --neutral-fill-input-rest: #f7f7f7;
        --neutral-focus: #838383;
        --neutral-outline-active: #cecece;
        --neutral-outline-hover: #909090;
        --neutral-outline-rest: #b6b6b6;
        --neutral-foreground-active: #262626;
        --neutral-foreground-hover: #262626;
        --accent-foreground-rest: #2a7d6e;
        --neutral-fill-rest: #e5e5e5;
        --neutral-fill-hover: #dddddd;
        --neutral-fill-active: #eaeaea;
        --neutral-focus-inner-accent: #ffffff;
        --accent-foreground-hover: #236a5e;
        --accent-foreground-active: #358678;
        --neutral-fill-stealth-rest: #f7f7f7;
        --neutral-fill-stealth-hover: #eaeaea;
        --neutral-fill-stealth-active: #efefef;
        --neutral-divider-rest: #e2e2e2;
        --neutral-layer-floating: #ffffff;
        --neutral-foreground-hint: #717171;

        /* Segments Line */
        --segments-progress-color: rgba(189, 224, 255, 1);
        --segments-line-bg: rgba(0, 0, 0, 0.05);
        --segments-color: rgba(0, 0, 0, 0.8);
        --segments-tooltip: rgba(0, 0, 0, 0.08);
        --segments-tooltip-text: #f7f7f7;
        --segments-active-color: white;

        /* Time Ruler */
        --ruler-small-scale-color: #8a8886;
        --ruler-text-color: #444444;
        --ruler-time-color: #c8c6c4;

        /* Layer Label */
        --layer-label-bg: rgba(17, 16, 15, 0.9);
        --layer-label-color: #f3f2f1;

        /* Actions Menu */
        --actions-menu-bg: rgba(17, 16, 15, 0.9);
        --actions-menu-color: #f3f2f1;

        /* Drawer Canvas */
        --drawer-line-color: #db4646;
        --drawer-fill-color: rgba(219, 70, 70, 0.4);
    }
`;
