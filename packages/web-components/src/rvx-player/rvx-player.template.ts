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
            <span class="col camera-name">${(x) => x.cameraName}</span>
            <div class="date-picker col">
                <span class="time-container">${(x) => x.time}</span>
                <media-date-picker class="date-picker-component" alignRight="${true}"></media-date-picker>
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
                                aria-label="${(x) => x.resources.PLAYER_Retry}"
                                title="${(x) => x.resources.PLAYER_Retry}"
                                @keyup="${(x, c) => x.handleRetryKeyUp(c.event as KeyboardEvent)}"
                                @mouseup="${(x, c) => x.handleRetryMouseUp(c.event as MouseEvent)}"
                                >Retry</fast-button
                            >
                        `
                    )}
                </div>
            `
        )}
        <div
            shaka-controls="true"
            class="video-container 
            ${(x) => (x.isLive ? 'live' : 'vod')} ${(x) => (x.isFullscreen ? 'fullscreen' : '')}"
        >
            <video class="video-element"></video>
        </div>
    </template>
`;
