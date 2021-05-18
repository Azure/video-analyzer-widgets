import { css } from '@microsoft/fast-element';

export const styles = css`
    :host {
        display: inline-block;
        font-family: var(--font-family);
        --corner-radius: 0;
        color: var(--actions-menu-color);
    }

    .fast-menu-container {
        position: relative;
    }

    fast-menu {
        position: absolute;
        width: max-content;
        visibility: hidden;
        z-index: 1;
    }

    fast-button {
        display: inline-grid;
    }
`;
