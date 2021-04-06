import { css } from '@microsoft/fast-element';

export const styles = css`
    :host {
        display: inline-grid;
        gap: 8px;
        grid-template-rows: 30px;
        align-items: center;
        border-radius: 4px;
        padding: 0 4px;
        background: var(--layer-label-bg);
        color: var(--layer-label-color);
    }

    :host(.compact) {
        grid-template-columns: auto;
    }

    :host(.expanded) {
        grid-template-columns: 16px auto auto;
    }

    :host(.actions) {
        grid-template-columns: 20px auto 30px;
    }

    :host(.actions) .color-container {
        display: inline-block;
        width: 20px;
        height: 20px;
    }

    .color-container {
        display: inline-block;
        width: 16px;
        height: 16px;
    }

    .label {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        min-width: 20px;
    }

    .label-prefix {
        font-weight: 600;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        min-width: 20px;
    }

    .red {
        background: #db4646;
    }

    .light-blue {
        background: #4d9dff;
    }

    .yellow {
        background: #fabe14;
    }

    .magenta {
        background: #cf0076;
    }

    .teal {
        background: #1cc2b2;
    }

    .purple {
        background: #7633c3;
    }

    .lime {
        background: #a6c102;
    }

    .blue {
        background: #0840cf;
    }

    .green {
        background: #0f9d49;
    }

    .orange {
        background: #f2880c;
    }

    media-actions-menu {
        --design-unit: 3;
    }
`;
