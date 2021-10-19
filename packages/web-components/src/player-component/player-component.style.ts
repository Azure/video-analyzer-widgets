import { css } from '@microsoft/fast-element';
import { secondaryAccentButtonStyle } from '../../../styles/system-providers/ava-design-system-provider.style';
import { stylesShaka } from './shaka-controls.style';
import { timeTooltipStyle } from './UI/time-tooltip.style';

const timelineHeight = '76px';
const bottomControlHeight = '48px';

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
        padding-bottom: 48px;
    }

    .error-container {
        display: none;
        position: absolute;
        z-index: 10;
        /* 100% minus controllers and timeline*/
        height: calc(100% - 48px - 49px);
        width: 100%;
        flex-direction: column;
    }

    .upper-bounding .hide {
        display: none !important;
    }

    :host(.loading) .upper-bounding {
        visibility: hidden;
    }

    .error-container > fast-button {
        margin-top: 16px;
    }

    video.error {
        visibility: hidden;
    }

    :host(.live-off.timeline-on.bottom-controls-on) {
        padding-bottom: calc(${bottomControlHeight} + ${timelineHeight});
    }

    :host(.live-off.timeline-on.bottom-controls-on) .shaka-controls-container.live-off {
        height: calc(100% + ${bottomControlHeight} + ${timelineHeight});
    }

    :host(.live-off.timeline-on.bottom-controls-on) .shaka-video-container.fullscreen .shaka-controls-container.live-off .shaka-bottom-controls {
        padding-bottom: calc(${bottomControlHeight} + ${timelineHeight} + 2px) !important;
    }

    :host(.live-off.timeline-off.bottom-controls-on),
    :host(.live-on.bottom-controls-on) {
        padding-bottom: ${bottomControlHeight};
    }

    :host(.live-off.timeline-off.bottom-controls-on) .shaka-controls-container.live-off,
    :host(.live-on.bottom-controls-on) .shaka-controls-container.live-on {
        height: calc(100% + ${bottomControlHeight});
    }

    :host(.live-off.timeline-off.bottom-controls-on) .shaka-video-container.fullscreen .shaka-controls-container.live-off .shaka-bottom-controls,
    :host(.live-on.bottom-controls-on) .shaka-video-container.fullscreen .shaka-controls-container.live-on .shaka-bottom-controls {
        padding-bottom: calc(${bottomControlHeight} + 2px) !important;
    }

    :host(.live-off.timeline-on.bottom-controls-off) {
        padding-bottom: ${timelineHeight};
    }

    :host(.live-off.timeline-on.bottom-controls-off) .shaka-controls-container.live-off {
        height: calc(100% + ${timelineHeight});
    }

    :host(.live-off.timeline-on.bottom-controls-off) .shaka-video-container.fullscreen .shaka-controls-container.live-off .shaka-bottom-controls {
        padding-bottom: calc(${timelineHeight} + 2px) !important;
    }

    :host(.live-off.timeline-off.bottom-controls-off),
    :host(.live-on.bottom-controls-off) {
        padding-bottom: 0px;
    }

    :host(.live-off.timeline-off.bottom-controls-off) .shaka-controls-container.live-off,
    :host(.live-on.bottom-controls-off) .shaka-controls-container.live-on {
        height: calc(100%);
    }

    :host(.live-off.timeline-off.bottom-controls-off) .shaka-video-container.fullscreen .shaka-controls-container.live-off .shaka-bottom-controls,
    :host(.live-on.bottom-controls-off) .shaka-video-container.fullscreen .shaka-controls-container.live-on .shaka-bottom-controls {
        padding-bottom: 2px !important;
    }

    :host(.loading),
    :host(.error) {
        background: black;
    }

    :host(.error) .error-container {
        align-items: center;
        display: flex;
        justify-content: center;
    }

    :host(.error) .shaka-spinner-container {
        display: none;
    }

    :host(.no-live-data) .live-button-component {
        display: none;
    }

    :host(.timeline-off) media-timeline {
        display: none;
    }

    :host(.upper-bounding-off) .upper-bounding {
        display: none;
    }

    ${stylesShaka}

    .shaka-video-container {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
        width: 100%;
        height: 100%;
    }

    .shaka-bottom-controls {
        padding: 0 !important;
    }

    .shaka-video-container.live .hours-label,
    .shaka-video-container.live .next-day-button,
    .shaka-video-container.live .prev-day-button,
    .shaka-video-container.live .prev-segment-button,
    .shaka-video-container.live .next-segment-button,
    .shaka-video-container.live .shaka-fast-forward-button,
    .shaka-video-container.live .shaka-rewind-button,
    .shaka-video-container.live .shaka-current-time,
    .shaka-video-container.live .shaka-seek-bar-container {
        display: none;
    }

    .shaka-video-container.vod .shaka-seek-bar-container,
    .shaka-video-container.vod .shaka-current-time {
        display: none;
    }

    .shaka-video-container.clip .hours-label,
    .shaka-video-container.clip .next-day-button,
    .shaka-video-container.clip .prev-day-button,
    .shaka-video-container.clip .prev-segment-button,
    .shaka-video-container.clip .next-segment-button,
    .shaka-video-container.clip .shaka-fast-forward-button,
    .shaka-video-container.clip .shaka-rewind-button {
        display: none;
    }

    .shaka-video-container.clip .shaka-seek-bar-container {
        top: 0px;
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

    .live-button-component.live-on.disabled {
        color: var(--segment-live);
        border: none;
        opacity: 1;
    }

    .live-button-component.live-off {
        background: var(--segment-bg);
        border: 1px solid var(--segment-bg);
        color: var(--type-disabled);
        margin: 0px 9px;
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
        aspect-ratio: 16 / 9;
        background: black;
    }

    .upper-bounding {
        padding: 0 20px;
        height: 49px;
        background: var(--bg-controls);
        align-items: center;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: [camera-name] 1fr [date-picker] 2fr;
    }

    .col.camera-name {
        grid-column-start: camera-name;
        grid-column-end: camera-name;
        grid-row-start: 1;
        grid-row-end: 1;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

    :host(.no-archive) .date-picker {
        display: none;
    }

    :host(.live-on) .rtsp-playback .metadata-overflow-menu-item {
        display: none;
    }

    :host(.live-on) .rtsp-playback .settings-overflow-menu-item {
        display: none;
    }

    :host(.loading) .shaka-spinner-container {
        display: flex !important;
    }

    .video-container.loading .shaka-spinner-container {
        display: flex !important;
    }

    ${timeTooltipStyle}

    ${secondaryAccentButtonStyle}
`;
