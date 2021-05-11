import { css } from '@microsoft/fast-element';
import { stylesShaka } from './shaka-controls.style';

export const styles = css`
    :host {
        display: inline-block;
        background: none;
        width: 100%;
        font-family: var(--font-family);
        --neutral-fill-rest: none;
        --density: 4;
        --design-unit: 2;
        --base-height-multiplier: 12;
        height: auto;
        position: relative;
    }

    .error {
        display: none;
        position: absolute;
        z-index: 1;
        /* 100% minus controllers and timeline*/
        height: calc(100% - 48px - 43px);
        width: 100%;
    }

    :host(.live-off) {
        /* add controllers and timeline */
        padding-bottom: calc(48px + 43px);
    }

    :host(.loading),
    :host(.error) {
        background: black;
    }

    :host(.error) .error {
        align-items: center;
        display: flex;
        justify-content: center;
    }

    ${stylesShaka}

    .shaka-video-container {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
    }

    .shaka-bottom-controls {
        padding: 8px 0;
    }

    .shaka-video-container.live .shaka-fast-forward-button,
    .shaka-video-container.live .shaka-rewind-button {
        display: none;
    }

    .shaka-video-container.vod .shaka-seek-bar-container {
        display: none;
    }

    .shaka-video-container .material-icons-round {
        font-size: 16px;
    }

    .shaka-volume-bar-container {
        height: 2px;
        border-radius: 0;
        opacity: 0;
        width: 0;
    }

    .shaka-volume-bar-container:hover {
        opacity: 1;
        width: 100px;
    }

    @media (max-width: 560px) {
        .shaka-volume-bar-container {
            display: none;
        }
    }

    .shaka-mute-button:hover + .shaka-volume-bar-container {
        transition: all 0.25s linear;
        opacity: 1;
        width: 100px;
    }

    .live-button-component .control .content {
        font-weight: 600;
        padding: 0 6px;
    }

    .live-button-component.live-on {
        color: var(--segment-live);
        border: var(--segment-live) 1px solid;
    }

    .live-button-component.live-off {
        background: var(--segment-bg);
        border: 1px solid var(--segment-bg);
        color: var(--type-disabled);
        margin: 0px 9px;
    }

    .prev-day-button {
        margin-left: 93px;
    }

    .prev-day-button,
    .next-day-button {
        border: 1px solid var(--secondary-stroke);
        border-radius: 2px;
    }

    .hours-label {
        color: var(--action);
        padding-left: 9px;
    }

    svg path {
        fill: var(--action);
    }

    button {
        background: 0 0;
        border: none;
        display: flex;
    }

    .shaka-hidden {
        display: none !important;
    }

    video {
        width: 100%;
        min-height: calc(100% * 9 / 16);
        background: black;
    }

    .upper-bounding {
        padding: 0 20px;
        height: 49px;
        background: var(--bg-controls);
        align-items: center;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: [camera-name] 90px [date-picker] auto;
    }

    .col.camera-name {
        grid-column-start: camera-name;
        grid-column-end: camera-name;
        grid-row-start: 1;
        grid-row-end: 1;
    }

    .col.date-picker {
        grid-column-start: date-picker;
        grid-column-end: date-picker;
        grid-row-start: 1;
        grid-row-end: 1;
        justify-self: end;
    }

    .date-picker .date-picker-component,
    .date-picker span {
        display: inline-block;
        vertical-align: middle;
        color: var(--action);
    }
`;
