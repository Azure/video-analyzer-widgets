import { css } from '@microsoft/fast-element';

export const styles = css`
    :host {
        font-family: var(--font-family);
        font-display: swap;
        display: inline-flex;
        width: 100%;
        justify-content: center;
    }

    .ruler {
        display: inline-grid;
    }
`;
