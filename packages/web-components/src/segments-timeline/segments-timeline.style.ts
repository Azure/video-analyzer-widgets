import { css } from '@microsoft/fast-element';

export const svgStyles = css`
    svg {
        font-family: 'Segoe UI';
        font-display: swap;
        font-size: 12px;
        -webkit-user-select: none;
        opacity: 0;
        transition: opacity 0.4s;
        -moz-transition: opacity 0.4s;
        -o-transition: opacity 0.4s;
        -webkit-transition: opacity 0.4s;
        outline: none;
    }

    .tooltip {
        opacity: 0;
    }

    .tooltip:hover {
        cursor: pointer;
        user-select: none;
    }

    .tooltip text {
        font-size: 0.9em;
    }

    .tooltip.default text {
        fill: var(--segments-tooltip-text);
    }

    rect {
        cursor: pointer;
    }

    rect.selected {
        fill: #1abc9c;
    }

    .buffer-progress {
        transition: transform 0.1s;
        -moz-transition: transform 0.1s;
        -o-transition: transform 0.1s;
        -webkit-transition: transform 0.1s;
        opacity: 0;
    }
    .buffer-progress:hover {
        opacity: 1;
    }

    .bar {
        fill: var(--segments-line-bg);
    }

    .buffer {
        opacity: 0;
        fill: rgba(0, 0, 0, 0.15);
    }

    .show {
        opacity: 1;
    }

    .progress {
        fill: var(--segments-progress-color);
    }

    .transition {
        transform-origin: left;
        transition: transform 0.2s, opacity 0.2s, x 0.2s, width 0.2s;
        -moz-transition: transform 0.2s, opacity 0.2s, x 0.2s, width 0.2s;
        -o-transition: transform 0.2s, opacity 0.2s, x 0.2s, width 0.2s;
        -webkit-transition: transform 0.2s, opacity 0.2s, x 0.2s, width 0.2s;
    }
`;

export const styles = css`
    ${svgStyles}
    :host {
        display: block;
        font-family: 'Arial';
        width: 100%;
    }
`;
