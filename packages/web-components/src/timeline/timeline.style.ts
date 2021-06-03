import { css } from '@microsoft/fast-element';
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
        right: 20px;
        bottom: 0px;
        height: 20px;
        margin: 0px;
        border-top: 1px solid var(--divider-alt);
        border-bottom: 1px solid var(--divider-alt);
        border-radius: 0px;
        padding-bottom: 4px;
    }

    .fast-slider-svg {
        width: 10px;
        height: 8px;
        margin-bottom: 2px;
    }

    .minus-svg {
        width: 100%;
        height: 1px;
        padding: 3px 0px 0 1px;
    }

    .plus-svg {
        width: 100%;
        height: 12px;
        padding: 3px 0px 0px 2px;
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
    .right-button {
        width: 18px;
        height: 18px;
        display: inline-grid;
        position: absolute;
        bottom: 0;
        border: 1px solid var(--divider-alt);
        --base-height-multiplier: 8px;
        border-radius: 0;
    }

    .right-button {
        right: 0px;
    }

    .left-button {
        right: 112px;
    }

    .simplebar-scrollbar::before {
        background-color: var(--divider-alt); /* color of the scroll thumb */
        border-radius: 4px; /* roundness of the scroll thumb */
    }

    ${simpleBarStyles}
`;
