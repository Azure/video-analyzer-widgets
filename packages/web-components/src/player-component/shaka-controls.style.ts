import { css } from '@microsoft/fast-element';

/* ! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export const stylesShaka = css`
    .shaka-hidden {
        display: none !important;
    }

    .shaka-video-container {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
    }
    .shaka-video-container .material-icons-round {
        font-family: var(--font-family);
        font-size: 24px;
    }
    .shaka-video-container * {
        font-family: var(--font-family);
    }
    .shaka-video-container:fullscreen {
        width: 100%;
        height: 100%;
        background-color: var(--player-background);
    }
    .shaka-video-container:fullscreen .shaka-text-container {
        font-size: 4.4vmin;
    }
    .shaka-video-container:-webkit-full-screen {
        width: 100%;
        height: 100%;
        background-color: var(--player-background);
    }
    .shaka-video-container:-webkit-full-screen .shaka-text-container {
        font-size: 4.4vmin;
    }
    .shaka-video-container:-moz-full-screen {
        width: 100%;
        height: 100%;
        background-color: var(--player-background);
    }
    .shaka-video-container:-moz-full-screen .shaka-text-container {
        font-size: 4.4vmin;
    }
    .shaka-video-container:-ms-fullscreen {
        width: 100%;
        height: 100%;
        background-color: var(--player-background);
    }
    .shaka-video-container:-ms-fullscreen .shaka-text-container {
        font-size: 4.4vmin;
    }
    .shaka-controls-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: calc(100% + 48px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        z-index: 1;
    }
    .shaka-controls-container.live-off {
        height: calc(100% + 48px + 76px);
    }
    .live-button-component {
        width: 34px;
        height: 22px;
        --outline-width: 0;
        --design-unit: -1;
    }
    .live-button-component button {
        font-weight: 600 !important;
    }
    media-timeline {
        z-index: 9;
        background-color: var(--timeline-background);
    }
    .shaka-video-container:not([shaka-controls='true']) .shaka-controls-container {
        display: none;
    }
    .shaka-controls-container * {
        flex-shrink: 0;
    }
    .shaka-controls-container[casting='true'] .shaka-fullscreen-button {
        display: none;
    }
    .shaka-bottom-controls {
        width: 100%;
        padding: 0;
        padding-bottom: 2.5%;
        z-index: 1;
        background-color: var(--bg-controls);
        padding: 0px 0px 8px !important;
    }
    .shaka-controls-button-panel {
        padding: 7px 14px;
        height: auto;
        margin: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        overflow: hidden;
        min-width: 48px;
        font-size: 12px;
        font-weight: 400;
        font-style: normal;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        /* opacity: 0; */
        transition: opacity cubic-bezier(0.4, 0, 0.6, 1) 0.6s;
    }
    .shaka-controls-container[casting='true'] .shaka-controls-button-panel,
    .shaka-controls-container[shown='true'] .shaka-controls-button-panel {
        opacity: 1;
    }

    .shaka-play-button-container {
        margin: 0;
        width: 100%;
        height: 100%;
        flex-shrink: 1;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .shaka-scrim-container {
        margin: 0;
        width: 100%;
        height: 100%;
        flex-shrink: 1;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        /* opacity: 0; */
        transition: opacity cubic-bezier(0.4, 0, 0.6, 1) 0.6s;
    }
    .shaka-controls-container[casting='true'] .shaka-scrim-container,
    .shaka-controls-container[shown='true'] .shaka-scrim-container {
        opacity: 1;
    }
    .shaka-text-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
        bottom: 0;
        width: 100%;
        min-width: 48px;
        transition: bottom cubic-bezier(0.4, 0, 0.6, 1) 0.1s;
        transition-delay: 0.5s;
    }
    .shaka-text-container div {
        font-size: 20px;
        line-height: 1.4;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
    }
    .shaka-controls-container[shown='true'] ~ .shaka-text-container {
        bottom: 15%;
        transition-delay: 0s;
    }
    .shaka-spinner-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        flex-shrink: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .shaka-video-container:not([shaka-controls='true']) .shaka-spinner-container {
        display: none;
    }
    .shaka-spinner {
        position: relative;
        top: 0;
        left: 0;
        margin: 0;
        box-sizing: border-box;
        padding: 7.8%;
        width: 0;
        height: 0;
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
    }
    .shaka-play-button {
        box-sizing: border-box;
        padding: 7.5%;
        width: 0;
        height: 0;
        margin: 0;
        border-radius: 50%;
        border: none;
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: rgba(255, 255, 255, 0.9);
        /* opacity: 0; */
        transition: opacity cubic-bezier(0.4, 0, 0.6, 1) 0.6s;
    }
    .shaka-controls-container[casting='true'] .shaka-play-button,
    .shaka-controls-container[shown='true'] .shaka-play-button {
        opacity: 1;
    }

    .shaka-current-time {
        font-size: 14px;
        color: #fff;
        height: auto;
        cursor: pointer;
    }
    .shaka-current-time[disabled] {
        background-color: transparent;
        color: #fff;
        cursor: default;
    }
    .shaka-controls-container fast-button:focus,
    .shaka-controls-container input:focus {
        outline: 1px solid Highlight;
        outline: 1px solid -webkit-focus-ring-color;
    }
    .shaka-controls-container fast-button:-moz-focus-inner,
    .shaka-controls-container input:-moz-focus-outer {
        outline: 0;
        border: 0;
    }
    .shaka-controls-container:not(.shaka-keyboard-navigation) fast-button:focus,
    .shaka-controls-container:not(.shaka-keyboard-navigation) input:focus {
        outline: 0;
    }
    .shaka-range-container {
        position: relative;
        top: 0;
        left: 0;
        margin: 0 0 4px 0;
        height: 2px;
        border-radius: 0;
        background: #fff;
    }
    .shaka-volume-bar-container {
        width: 100px;
    }
    .shaka-range-element {
        -webkit-appearance: none;
        background: 0 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        height: 12px;
        top: -4px;
        z-index: 1;
    }
    .shaka-range-element::-webkit-slider-runnable-track {
        width: 100%;
        height: 12px;
        background: 0 0;
        color: transparent;
        border: none;
    }
    .shaka-range-element::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        border-radius: 12px;
        height: 12px;
        width: 12px;
        background: #fff;
    }
    .shaka-range-element::-moz-range-track {
        width: 100%;
        height: 12px;
        background: 0 0;
        color: transparent;
        border: none;
    }
    .shaka-range-element::-moz-range-thumb {
        -webkit-appearance: none;
        border: none;
        border-radius: 12px;
        height: 12px;
        width: 12px;
        background: #fff;
    }
    .shaka-range-element::-ms-track {
        width: 100%;
        height: 12px;
        background: 0 0;
        color: transparent;
        border: none;
    }
    .shaka-range-element::-ms-thumb {
        -webkit-appearance: none;
        border: none;
        border-radius: 12px;
        height: 12px;
        width: 12px;
        background: #fff;
    }
    .shaka-range-element::-ms-tooltip {
        display: none;
    }
    .shaka-range-element::-ms-fill-lower {
        display: none;
    }
    .shaka-range-element::-ms-fill-upper {
        display: none;
    }
    .shaka-server-side-ad-container {
        display: none;
    }
    .shaka-seek-bar-container {
        /* opacity: 0; */
        transition: opacity cubic-bezier(0.4, 0, 0.6, 1) 0.6s;
    }
    .shaka-controls-container[casting='true'] .shaka-seek-bar-container,
    .shaka-controls-container[shown='true'] .shaka-seek-bar-container {
        opacity: 1;
    }
    .shaka-ad-markers {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    } /*!
 * @license
 * The SVG/CSS buffering spinner is based on http://codepen.io/jczimm/pen/vEBpoL
 * Some local modifications have been made.
 *
 * Copyright (c) 2016 by jczimm
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
    .shaka-spinner-svg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        animation: rotate 2s linear infinite;
        transform-origin: center center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
    .shaka-spinner-path {
        stroke: #202124;
        stroke-dasharray: 20, 200;
        stroke-dashoffset: 0;
        animation: dash 1.5s ease-in-out infinite;
        stroke-linecap: round;
    }
    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    .shaka-spacer {
        cursor: default;
        flex-shrink: 1;
        flex-grow: 1;
        margin: 0;
    }
    .shaka-overflow-menu,
    .shaka-settings-menu {
        overflow-x: hidden;
        overflow-y: auto;
        white-space: nowrap;
        border-radius: 2px;
        max-height: 250px;
        min-width: 180px;
        opacity: 0;
        transition: opacity cubic-bezier(0.4, 0, 0.6, 1) 0.6s;
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 15px;
        bottom: 42px;
        height: 169px;
        background: var(--overlay);
        z-index: 10;
    }
    .shaka-controls-container[casting='true'] .shaka-overflow-menu,
    .shaka-controls-container[casting='true'] .shaka-settings-menu,
    .shaka-controls-container[shown='true'] .shaka-overflow-menu,
    .shaka-controls-container[shown='true'] .shaka-settings-menu {
        opacity: 1;
    }
    .shaka-settings-menu.shaka-playback-rates {
        height: auto;
        max-height: inherit;
    }
    .shaka-overflow-menu fast-button,
    .shaka-settings-menu fast-button {
        font-size: 14px;
        line-height: 20px;
        color: var(--type-tertiary);
        border: none;
        height: 20px;
        padding: 8px;
        display: flex;
        align-items: center;
    }
    fast-button.body-tracking-on:after {
        content: '';
        display: block;
        height: 4px;
        width: 28px;
        margin: 0 2px;
        position: absolute;
        bottom: 1px;
        background-color: #8a8886;
    }
    .shaka-settings-menu fast-button.shaka-back-to-overflow-button {
        border-bottom: 1px solid var(--divider);
    }
    .shaka-overflow-menu:not(.shaka-hidden) {
        opacity: 1;
    }
    .shaka-overflow-menu fast-button:hover,
    .shaka-settings-menu fast-button:hover {
        background: var(--video-menu-hover);
    }
    .shaka-keyboard-navigation .shaka-overflow-menu fast-button:focus,
    .shaka-keyboard-navigation .shaka-settings-menu fast-button:focus {
        background: var(--video-menu-press);
    }
    .shaka-overflow-menu i,
    .shaka-settings-menu i {
        padding-left: 10px;
        padding-right: 10px;
    }
    .shaka-audio-languages fast-button,
    .shaka-resolutions fast-button,
    .shaka-playback-rates fast-button,
    .shaka-overflow-menu fast-button {
        --outline-width: 0;
        --focus-outline-width: 0;
    }
    .shaka-audio-languages fast-button svg,
    .shaka-resolutions fast-button svg,
    .shaka-playback-rates fast-button svg {
        padding-right: 8px;
    }
    .shaka-audio-languages fast-button svg path,
    .shaka-resolutions fast-button svg path,
    .shaka-playback-rates fast-button svg path {
        fill: var(--type-tertiary);
    }
    .shaka-overflow-menu .settings-header {
        padding: 8px;
        font-size: 14px;
        border-bottom: 1px solid var(--divider);
        color: var(--type-tertiary);
    }
    .shaka-overflow-menu .overflow-menu-item {
        padding: 8px;
        font-size: 14px;
        color: var(--type-tertiary);
    }
    .shaka-overflow-menu fast-checkbox {
        float: right;
    }
    .shaka-overflow-menu fast-button .material-icons-round {
        display: none;
    }
    .shaka-audio-languages fast-button::part(control),
    .shaka-resolutions fast-button::part(control),
    .shaka-playback-rates fast-button::part(control),
    .shaka-overflow-menu fast-button::part(control) {
        display: inline-block;
        padding: 0px;
        border: none;
    }
    .shaka-overflow-menu.shaka-low-position,
    .shaka-settings-menu.shaka-low-position {
        bottom: 15px;
    }
    .material-icons-round.shaka-chosen-item {
        font-style: normal;
        font-size: 0px !important;
    }
    .material-icons-round.shaka-chosen-item:before {
        font-family: 'avarvx-icons';
        content: '\\e008';
        font-size: 16px;
    }
    .shaka-overflow-menu span {
        text-align: left;
    }
    .shaka-overflow-button-label {
        position: relative;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto 50px;
    }
    .shaka-current-selection-span {
        color: var(--type-tertiary);
        justify-self: end;
        font-weight: 600;
    }
    .shaka-settings-menu span {
        margin-left: 54px;
    }
    .shaka-back-to-overflow-button span {
        margin-left: 0;
    }
    .shaka-auto-span {
        left: 17px;
    }
    .shaka-controls-container[ad-active='true'] {
        pointer-events: none;
    }
    .shaka-controls-container[ad-active='true'] .shaka-bottom-controls {
        pointer-events: auto;
    }
    .shaka-server-side-ad-container {
        width: 100%;
        height: 100%;
    }
    .shaka-server-side-ad-container:not([ad-active='true']) {
        pointer-events: none;
    }
    .shaka-client-side-ad-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .shaka-video-container[shaka-controls='true'] .shaka-controls-container iframe {
        height: 92%;
        z-index: 1;
    }
    .shaka-video-container:not([shaka-controls='true']) .shaka-ad-controls {
        display: none;
    }
`;
