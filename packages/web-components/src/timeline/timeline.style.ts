import { css } from '@microsoft/fast-element';

export const styles = css`
    :host {
        display: inline-block;
        font-family: var(--font-family);
        width: 100%;
        overflow-x: scroll;
    }

    media-time-ruler {
        margin-bottom: 4px;
    }

    fast-slider {
        width: 90px;
        position: absolute;
        --corner-radius: 10;
        --design-unit: 3;
    }

    :host::-webkit-scrollbar {
        width: 40px; /* width of the entire scrollbar */
        height: 20px;
        position: relative;
    }

    :host::-webkit-scrollbar-track {
        background: #201f1e; /* color of the tracking area */
        margin-right: 96px;
        display: inline-flex;
        position: relative;
    }

    :host::-webkit-scrollbar-thumb {
        background-color: #484644; /* color of the scroll thumb */
        border-radius: 20px; /* roundness of the scroll thumb */
        border: 6px solid #201f1e; /* creates padding around scroll thumb */
    }
`;
