import { css, ElementStyles } from '@microsoft/fast-element';

export const defaultColorsStyle: ElementStyles = css`
    :host {
<<<<<<< HEAD
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

        /* Date picker */
        --date-picker-holder-bg: #252423;
        --date-picker-text-color: #f3f2f1;
        --date-picker-bg-today: #2899f5;
        --date-picker-text-color-today: #1b1a19;
        --date-picker-disabled-text-color: #a6a6a6;
        --date-picker-out-focus-text-color: #a19f9d;
        --date-picker-focus-text-color: #f3f2f1;
        --date-picker-focus-text-color-hover: #605e5c;
        --date-picker-focus-bg-color-hover: #eaeaea;
        --date-picker-focus-month-hover-bg: #c8c8c8;
        --date-picker-divider-color: #484644;
        --date-picker-holder-box-shadow-1: rgba(0, 0, 0, 0.1);
        --date-picker-holder-box-shadow-2: rgba(0, 0, 0, 0.13);

        /* Layer Label */
        --layer-label-bg: rgba(17, 16, 15, 0.9);
        --layer-label-color: #f3f2f1;

        /* Actions Menu */
        --actions-menu-bg: rgba(17, 16, 15, 0.9);
        --actions-menu-color: #f3f2f1;

        /* Drawer Canvas */
        --drawer-line-color: #db4646;
        --drawer-fill-color: rgba(219, 70, 70, 0.4);

        /* Zone Draw */
        --zone-draw-color: #a19f9d;
        --zone-draw-bg: #201f1e;
        --zone-draw-selected-btn: #486444;
=======
        /* Colors */
        --primary: rgba(40, 153, 245, 1);
        --primary-hover: rgba(58, 160, 243, 1);
        --primary-press: rgba(108, 184, 246, 1);
        --primary-type: rgba(27, 26, 25, 1);
        --primary-type-alt: rgba(0, 76, 135, 1);
        --primary-disable: rgba(37, 36, 35, 1);
        --secondary-fill: rgba(27, 26, 25, 1);
        --secondary-fill-hover: rgba(37, 36, 35, 1);
        --secondary-fill-press: rgba(41, 40, 39, 1);
        --secondary-stroke: rgba(138, 136, 134, 1);
        --secondary-focus: rgba(161, 159, 157, 1);
        --secondary-disable: rgba(37, 36, 35, 1);
        --component-fill: rgba(37, 36, 35, 1);
        --component-stroke: rgba(161, 159, 157, 1);
        --component-stroke-alt: rgba(243, 242, 241, 1);
        --action: rgba(243, 242, 241, 1);
        --action-highlight: rgba(250, 249, 248, 1);
        --action-fill-hover: rgba(50, 49, 48, 1);
        --action-fill-press: rgba(59, 58, 57, 1);
        --action-disabled: rgba(121, 119, 117, 1);
        --ruler-line: rgba(243, 242, 241, 1);
        --ruler-line-alt: rgba(138, 136, 134, 1);
        --video-buffer: rgba(96, 94, 92, 0.75);
        --segment-selected: rgba(243, 242, 241, 1);
        --segment-rest: rgba(96, 94, 92, 1);
        --segment-hover: rgba(138, 136, 134, 1);
        --segment-live: rgba(26, 188, 156, 1);
        --segment-bg: rgba(50, 49, 48, 1);
        --play-indicator: rgba(208, 46, 0, 1);
        --overlay: rgba(17, 16, 15, 0.9);
        --overlay-alt: rgba(17, 16, 15, 0.7);
        --divider: rgba(96, 94, 92, 1);
        --divider-alt: rgba(72, 70, 68, 1);
        --bg-controls: rgba(22, 21, 20, 1);
        --bg-dialog: rgba(32, 31, 30, 1);
        --bg-menu: rgba(37, 36, 35, 1);
        --bg-video: rgba(0, 0, 0, 1);
        --bg-primary: #f9f9f9;
        --type-highlight: rgba(250, 249, 248, 1);
        --type-primary: rgba(0, 0, 0, 0.8);
        --type-secondary: rgba(0, 0, 0, 0.62);
        --type-tertiary: rgba(161, 159, 157, 1);
        --type-disabled: rgba(121, 119, 117, 1);
        --type-disabled-alt: rgba(72, 70, 68, 1);
>>>>>>> develop
    }
`;
