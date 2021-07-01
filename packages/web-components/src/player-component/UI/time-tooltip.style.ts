import { css } from '@microsoft/fast-element';

export const timeTooltipStyle = css`
    .mouse-display-container {
        position: absolute;
        pointer-events: none;
        width: 1px;
        z-index: 1;
        display: none;
    }

    .time-tooltip {
        background-color: var(--overlay) !important;
        color: var(--type-primary);
        min-width: 50px;
        font-size: 14px !important;
        line-height: 20px;
        top: -37px;
        position: absolute;
        display: block;
        padding: 4px 8px;
    }
`;
