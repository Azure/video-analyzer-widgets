import { css } from '@microsoft/fast-element';

export const svgStyles = css`
    svg {
        font-family: 'Segoe UI';
        font-display: swap;
        font-size: 11px;
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
        fill: #dddddd;
    }
    .tooltip:hover {
        fill: #d0d0d0;
        cursor: pointer;
        user-select: none;
    }
    .tooltip text {
        font-size: 0.9em;
    }
    .tooltip.default {
        fill: #dddddd;
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
        fill: rgba(0, 0, 0, 0.1);
    }

    .buffer {
        opacity: 0;
        fill: rgba(0, 0, 0, 0.15);
    }

    .show {
        opacity: 1;
    }

    .progress {
        fill: var(--timeline-progress-color);
    }

    .transition {
        transform-origin: left;
        transition: transform 0.2s, opacity 0.2s, x 0.2s, width 0.2s;
        -moz-transition: transform 0.2s, opacity 0.2s, x 0.2s, width 0.2s;
        -o-transition: transform 0.2s, opacity 0.2s, x 0.2s, width 0.2s;
        -webkit-transition: transform 0.2s, opacity 0.2s, x 0.2s, width 0.2s;
    }

    .neutral {
        fill: rgba(44, 66, 0, 0);
    }

    .default {
        fill: #2c3e50;
    }

    /*# sourceMappingURL=styles.css.map */
`;

export const styles = css`
    ${svgStyles}
    :host {
        display: block;
        font-family: 'Arial';
        width: 100%;
    }

    .has-text {
        color: rgb(0 0 255);
    }
`;
