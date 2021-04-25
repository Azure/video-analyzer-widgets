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
        font-family: 'Segoe UI';
        font-size: 24px;
    }
    .shaka-video-container * {
        font-family: 'Segoe UI';
    }
    .shaka-video-container:fullscreen {
        width: 100%;
        height: 100%;
        background-color: #000;
    }
    .shaka-video-container:fullscreen .shaka-text-container {
        font-size: 4.4vmin;
    }
    .shaka-video-container:-webkit-full-screen {
        width: 100%;
        height: 100%;
        background-color: #000;
    }
    .shaka-video-container:-webkit-full-screen .shaka-text-container {
        font-size: 4.4vmin;
    }
    .shaka-video-container:-moz-full-screen {
        width: 100%;
        height: 100%;
        background-color: #000;
    }
    .shaka-video-container:-moz-full-screen .shaka-text-container {
        font-size: 4.4vmin;
    }
    .shaka-video-container:-ms-fullscreen {
        width: 100%;
        height: 100%;
        background-color: #000;
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
        height: calc(100% + 48px + 43px);
    }
    media-timeline {
        z-index: 9;
        background-color: rgb(26, 26, 26);
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
        background-color: #161514;
        padding: 0px 0px 8px !important;
    }
    .shaka-controls-button-panel {
        padding: 0 14px;
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
        background: linear-gradient(to top, #000 0, rgba(0, 0, 0, 0) 15%);
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
        box-shadow: rgba(0, 0, 0, 0.1) 0 0 20px 0;
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
    .shaka-controls-container button:focus,
    .shaka-controls-container input:focus {
        outline: 1px solid Highlight;
        outline: 1px solid -webkit-focus-ring-color;
    }
    .shaka-controls-container button:-moz-focus-inner,
    .shaka-controls-container input:-moz-focus-outer {
        outline: 0;
        border: 0;
    }
    .shaka-controls-container:not(.shaka-keyboard-navigation) button:focus,
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
        background: #fff;
        box-shadow: 0 1px 9px 0 rgba(0, 0, 0, 0.4);
        border-radius: 2px;
        max-height: 250px;
        min-width: 180px;
        opacity: 0;
        transition: opacity cubic-bezier(0.4, 0, 0.6, 1) 0.6s;
        display: flex;
        flex-direction: column;
        position: absolute;
        z-index: 2;
        right: 15px;
        bottom: 30px;
    }
    .shaka-controls-container[casting='true'] .shaka-overflow-menu.shaka-displayed,
    .shaka-controls-container[casting='true'] .shaka-settings-menu.shaka-displayed,
    .shaka-controls-container[shown='true'] .shaka-overflow-menu.shaka-displayed,
    .shaka-controls-container[shown='true'] .shaka-settings-menu.shaka-displayed {
        opacity: 1;
    }
    .shaka-overflow-menu button,
    .shaka-settings-menu button {
        font-size: 14px;
        background: 0 0;
        color: #000;
        border: none;
        min-height: 30px;
        padding: 3.5px 6px;
        display: flex;
        align-items: center;
    }
    .shaka-overflow-menu button:hover,
    .shaka-settings-menu button:hover {
        background: #e0e0e0;
    }
    .shaka-keyboard-navigation .shaka-overflow-menu button:focus,
    .shaka-keyboard-navigation .shaka-settings-menu button:focus {
        background: #e0e0e0;
    }
    .shaka-overflow-menu i,
    .shaka-settings-menu i {
        padding-left: 10px;
        padding-right: 10px;
    }
    .shaka-overflow-menu.shaka-low-position,
    .shaka-settings-menu.shaka-low-position {
        bottom: 15px;
    }
    .shaka-overflow-menu span {
        text-align: left;
    }
    .shaka-overflow-button-label {
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .shaka-current-selection-span {
        color: rgba(0, 0, 0, 0.54);
    }
    .shaka-settings-menu span {
        margin-left: 54px;
    }
    .shaka-back-to-overflow-button span {
        margin-left: 0;
    }
    .shaka-back-to-overflow-button i {
        padding-right: 20px;
    }
    .shaka-auto-span {
        left: 17px;
    }
    .shaka-captions-on {
        color: #000;
    }
    .shaka-captions-off {
        color: grey;
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
    .shaka-ad-controls {
        display: flex;
        flex-direction: row;
        z-index: 1;
        padding-bottom: 1%;
    }
    .shaka-video-container:not([shaka-controls='true']) .shaka-ad-controls {
        display: none;
    }
    .shaka-ad-controls button,
    .shaka-ad-controls div {
        color: #fff;
        font-size: initial;
    }
    .shaka-ad-controls div:not(.shaka-skip-ad-counter) {
        margin: 1px 6px;
    }
    .shaka-ad-counter,
    .shaka-ad-position {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        text-shadow: 1px 1px 4px #000;
    }
    .shaka-skip-ad-container {
        position: relative;
        right: -2%;
        display: flex;
        flex-direction: row;
        margin: 0;
    }
    .shaka-skip-ad-button {
        padding: 5px 15px;
        background: rgba(0, 0, 0, 0.7);
        border: none;
        cursor: pointer;
    }
    .shaka-skip-ad-button:disabled {
        background: rgba(0, 0, 0, 0.3);
    }
    .shaka-skip-ad-counter {
        padding: 5px 5px;
        background: rgba(0, 0, 0, 0.7);
        margin: 0;
    }
`;
