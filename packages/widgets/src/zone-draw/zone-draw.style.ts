import { css } from '@microsoft/fast-element';

export const styles = css`
    :host {
        font-family: var(--font-family);
        display: grid;
        grid-template-rows: 30px auto 32px;
        padding: 20px 22px;
        background: var(--zone-draw-bg);
        color: #a19f9d;
        min-width: 720px;
    }

    .draw-buttons > fast-button {
        min-width: 16px;
        align-items: center;
        justify-content: center;
        background: transparent;
        width: 30px;
        height: 30px;
    }

    .draw-options-container {
        display: inline-flex;
        align-items: center;
    }

    .draw-buttons {
        display: inline-flex;
        border: 1px solid #8a8886;
        box-sizing: border-box;
        border-radius: 2px;
        margin-right: 12px;
    }

    .zones-draw-container {
        height: 100%;
        position: relative;
    }

    .draw-zone-container {
        width: 100%;
        height: calc(100% - 96px);
        position: absolute;
        padding-bottom: 48px;
        padding-top: 47px;
        display: block;
    }

    .draw-zone {
        position: relative;
        display: block;
        height: 100%;
    }

    .zones-container {
        display: grid;
        width: 100%;
        height: calc(100% - 41px);
        grid-template-columns: 75% 25%;
        padding: 20px 0;
    }

    .zones-list-container {
        padding-left: 12px;
        font-size: 14px;
        overflow: hidden;
        overflow-y: auto;
    }

    .action-buttons {
        justify-content: flex-end;
        display: flex;
        align-items: center;
    }

    .action-buttons > fast-button {
        width: 75px;
        height: 32px;
        border: 1px solid rgba(255, 255, 255, 0.54);
        box-sizing: border-box;
        border-radius: 2px;
        background: #1a1a1a;
        margin-left: 12px;
    }

    fast-button.selected {
        background: #484644;
    }

    media-line-drawer,
    media-zones-view {
        position: absolute;
        height: 100%;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin-bottom: 12px;
    }

    li > media-layer-label {
        width: calc(100% - 40px);
        height: 48px;
        grid-template-rows: auto;
        padding: 0 12px;
        border-radius: 0;
    }

    fast-dialog {
        width: 100%;
        height: 100%;
    }

    li > media-layer-label > media-editable-text-field {
        height: 30px;
    }
`;
