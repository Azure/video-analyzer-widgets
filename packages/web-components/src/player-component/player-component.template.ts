import { html, when } from '@microsoft/fast-element';
import { PlayerComponent } from '.';

/**
 * Player component
 * @public
 */
/* eslint-disable  @typescript-eslint/indent */
export const template = html<PlayerComponent>`
    <template>
        <div class="upper-bounding">
            <span class="col camera-name ${(x) => (x.showCameraName ? 'show' : 'hide')}">${(x) => x.cameraName}</span>
            <div class="date-picker col">
                <span class="time-container ${(x) => (x.showTimestamp ? 'show' : 'hide')}">${(x) => x.time}</span>
                <media-date-picker
                    class="date-picker-component ${(x) => (x.showDatePicker ? 'show' : 'hide')}"
                    alignRight="${true}"
                ></media-date-picker>
            </div>
        </div>
        ${when(
            (x) => x.hasError,
            html`
                <div class="error-container">
                    <span class="error">${(x) => x.errorString}</span>
                    ${when(
                        (x) => x.showRetryButton,
                        html`
                            <fast-button
                                appearance="accent"
                                class="secondary"
                                aria-label="${(x) => x.resources?.PLAYER_Retry}"
                                title="${(x) => x.resources?.PLAYER_Retry}"
                                @keyup="${(x, c) => x.handleRetryKeyUp(c.event as KeyboardEvent)}"
                                @click="${(x) => x.handleRetry()}"
                                >${(x) => x.resources?.PLAYER_Retry}</fast-button
                            >
                            <fast-button
                                appearance="accent"
                                class="secondary switch-to-dash-button"
                                aria-label="${(x) => x.resources?.PLAYER_SwitchToDash}"
                                title="${(x) => x.resources?.PLAYER_SwitchToDash}"
                                @keyup="${(x, c) => x.handleSwitchToDashKeyUp(c.event as KeyboardEvent)}"
                                @click="${(x) => x.handleSwitchToDash()}"
                                >${(x) => x.resources?.PLAYER_SwitchToDash}</fast-button
                            >
                        `
                    )}
                </div>
            `
        )}
        <div
            shaka-controls="true"
            class="video-container 
            ${(x) => (x.isLive ? 'live' : x.isClip ? 'clip' : 'vod')} ${(x) => (x.isFullscreen ? 'fullscreen' : '')}"
        >
            <video crossorign="use-credentials" playsinline class="video-element" :muted="${(x) => x.isMuted}"></video>
        </div>
    </template>
`;
