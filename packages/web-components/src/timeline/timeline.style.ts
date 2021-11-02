import { css } from '@microsoft/fast-element';
import { timeTooltipStyle } from '../player-component/UI/time-tooltip.style';
import { simpleBarStyles } from './scrollbar.style';

export const styles = css`
    :host {
        display: inline-block;
        font-family: var(--font-family);
        width: 100%;
    }

    media-time-ruler {
        margin-bottom: 4px;
    }

    fast-slider {
        width: 92px;
        position: absolute;
        --corner-radius: 10;
        --design-unit: 1;
        --density: 0;
        right: 40px;
        bottom: 0px;
        height: 20px;
        margin: 0px;
        // border-top: 1px solid var(--divider-alt);
        // border-bottom: 1px solid var(--divider-alt);
        border-radius: 0px;
        padding-bottom: 1px;
    }

    .fast-slider-svg {
        width: 10px;
        height: 15px;
        position: relative;
        bottom: 1px;
        right: 3px;
    }

    .minus-svg {
        width: 11px;
        height: 1px;
    }

    .plus-svg {
        width: 11px;
        height: 11px;
    }

    .reset-svg {
        width: 16px;
        height: 12px;
    }

    .scroll-container {
        padding-bottom: 20px;
    }

    .scroll-container.disable-zoom {
        padding-bottom: 0;
    }

    .zoom-controls-container {
        width: 100%;
        position: relative;
    }

    .marker-path {
        color: var(--action);
    }

    .marker-bg-path {
        color: var(--bg-controls);
    }

    .left-button,
    .right-button,
    .reset-button {
        width: 20px;
        height: 20px;
        display: inline-grid;
        position: absolute;
        bottom: 0;
        // border: 1px solid var(--divider-alt);
        --base-height-multiplier: 8px;
        border-radius: 0;
    }

    fast-slider,
    .left-button,
    .right-button,
    .reset-button {
        background-color: var(--bg-dialog);
    }

    .right-button {
        right: 20px;
    }

    .left-button {
        right: 132px;
    }

    .zoom-slider {
        border: 1px solid var(--bg-dialog);
    }

    .reset-button {
        right: 0px;
    }

    .simplebar-scrollbar::before {
        background-color: var(--type-primary); /* color of the scroll thumb */
        border-radius: 4px; /* roundness of the scroll thumb */
    }

    ${timeTooltipStyle}

    ${simpleBarStyles}
`;
