import { css } from '@microsoft/fast-element';

export const styles = css`
    :host {
        display: inline-block;
        font-family: var(--font-family);
        --corner-radius: 0;
        color: var(--actions-menu-color);
    }

    fast-menu {
        position: absolute;
        display: block;
        width: fit-content;
        visibility: hidden;
    }

    fast-button {
        display: inline-grid;
    }
`;
