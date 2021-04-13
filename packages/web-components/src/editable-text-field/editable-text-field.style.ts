import { css } from '@microsoft/fast-element';

export const styles = css`
    :host {
        font-family: var(--font-family);
        --corner-radius: 0;
        display: inline-flex;
    }

    .edit-container {
        display: grid;
        grid-template-columns: auto minmax(auto, 40px);
        height: 100%;
        width: 100%;
    }

    fast-button {
        min-width: 16px;
        min-height: 16px;
        height: auto;
    }

    input {
        min-width: 100px;
    }
`;
