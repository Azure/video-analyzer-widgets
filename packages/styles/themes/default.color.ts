import { css, ElementStyles } from '@microsoft/fast-element';

export const defaultColorsStyle: ElementStyles = css`
    :host {
        /* Light Colors */
        --primary: rgba(0, 120, 212, 1);
        --primary-hover: rgba(16, 110, 190, 1);
        --primary-press: rgba(0, 90, 158, 1);
        --primary-type: rgba(255, 255, 255, 1);
        --primary-type-alt: rgba(0, 90, 158, 1);
        --primary-disable: rgba(243, 242, 241, 1);
        --secondary-fill: rgba(255, 255, 255, 1);
        --secondary-fill-hover: rgba(243, 242, 241, 1);
        --secondary-fill-press: rgba(237, 235, 233, 1);
        --secondary-stroke: rgba(138, 136, 134, 1);
        --secondary-focus: rgba(96, 94, 92, 1);
        --secondary-disable: rgba(243, 242, 241, 1);
        --component-fill: rgba(243, 242, 241, 1);
        --component-stroke: rgba(72, 70, 68, 1);
        --component-stroke-alt: rgba(32, 31, 30, 1);
        --action: rgba(32, 31, 30, 1);
        --action-highlight: rgba(22, 21, 20, 1);
        --action-fill-hover: rgba(243, 242, 241, 1);
        --action-fill-press: rgba(237, 235, 233, 1);
        --action-disabled: rgba(243, 242, 241, 1);
        --video-menu-hover: rgba(255, 255, 255, 0.25);
        --video-menu-press: rgba(255, 255, 255, 0.4);
        --ruler-line: rgba(32, 31, 30, 1);
        --ruler-line-alt: rgba(50, 49, 48, 1);
        --video-buffer: rgba(96, 94, 92, 0.75);
        --segment-selected: rgba(41, 40, 39, 1);
        --segment-rest: rgba(121, 119, 117, 1);
        --segment-hover: rgba(72, 70, 68, 1);
        --segment-live: rgba(18, 134, 110, 1);
        --segment-bg: rgba(225, 223, 221, 1);
        --play-indicator: rgba(208, 46, 0, 1);
        --play-head: rgba(27, 26, 25, 1);
        --overlay: rgba(255, 255, 255, 0.9);
        --overlay-alt: rgba(255, 255, 255, 0.7);
        --divider: rgba(243, 242, 241, 1);
        --divider-alt: rgba(225, 223, 221, 1);
        --bg-primary: #f9f9f9;
        --bg-controls: rgba(255, 255, 255, 1);
        --bg-dialog: rgba(250, 249, 248, 1);
        --bg-menu: rgba(255, 255, 255, 1);
        --bg-video: rgba(255, 255, 255, 1);
        --type-highlight: rgba(32, 31, 30, 1);
        --type-primary: rgba(50, 49, 48, 1);
        --type-secondary: rgba(96, 94, 92, 1);
        --type-tertiary: rgba(96, 94, 92, 1);
        --type-disabled: rgba(161, 159, 157, 1);
        --type-disabled-alt: rgba(138, 136, 134, 1);
        --timeline-background: rgba(255, 255, 255, 1);
    }
`;
