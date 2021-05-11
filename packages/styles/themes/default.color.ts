import { css, ElementStyles } from '@microsoft/fast-element';

export const defaultColorsStyle: ElementStyles = css`
    :host {
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
    }
`;
