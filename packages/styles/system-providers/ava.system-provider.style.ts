import { css } from '@microsoft/fast-element';

export const style = css`
    :host {
        display: block;
        justify-content: center;
        font-display: swap;
        --body-font: 'Segoe UI';
    }

    [class^='active'] {
        content: '';
        display: block;
        height: calc(var(--outline-width) * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }
`;
