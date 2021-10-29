import { BaseWidget } from '../base-widget';
import { customElement, attr } from '@microsoft/fast-element';
import { IAvaPlayerConfig, PlayerEvents } from './definitions';
import { TokenHandler } from '../../../common/services/auth/token-handler.class';
import { AvaAPi } from '../../../common/services/auth/ava-api.class';
import { MediaApi } from '../../../common/services/media/media-api.class';
import { template } from './player-widget.template';
import { styles } from './player-widget.style';
import { PlayerComponent } from '../../../web-components/src/player-component';
import { ControlPanelElements, ISource } from '../../../web-components/src/player-component/player-component.definitions';
import { Logger } from '../common/logger';
import { AvaDesignSystemProvider } from '../../../styles';
import { HttpError } from '../../../common/utils/http.error';
import { IClipTimeRange } from './definitions/player-config.definitions';

/* eslint-disable @typescript-eslint/no-unused-expressions */
AvaDesignSystemProvider;
PlayerComponent;

@customElement({
    name: 'ava-player',
    template,
    styles
})
export class Player extends BaseWidget {
    @attr({ mode: 'fromView' })
    public config: IAvaPlayerConfig;
    private loaded = false;
    private source: ISource = null;
    private allowedControllers: ControlPanelElements[] = null;
    private clipTimeRange: IClipTimeRange;
    private isMuted: boolean;

    public constructor(config: IAvaPlayerConfig) {
        super(config);
        if (this.config) {
            this.init();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public get shakaPlayer(): any {
        const playerComponent: PlayerComponent = this.shadowRoot.querySelector('media-player');
        if (playerComponent) {
            return playerComponent.player?.player;
        }
        return null;
    }

    public connectedCallback() {
        super.connectedCallback();
        this.validateOrAddDesignSystem();
        const designSystem = this.shadowRoot.querySelector('ava-design-system-provider') as AvaDesignSystemProvider;
        if (designSystem) {
            designSystem.style.width = this.width;
            designSystem.style.height = this.height;
        }
    }

    public setAccessToken(token: string) {
        if (token) {
            this.config.token = token;
            TokenHandler.avaAPIToken = this.config.token;
        }
    }

    public play() {
        const playerComponent: PlayerComponent = this.shadowRoot.querySelector('media-player');
        playerComponent.play();
    }

    public pause() {
        const playerComponent: PlayerComponent = this.shadowRoot.querySelector('media-player');
        playerComponent.pause();
    }

    public configure(config: IAvaPlayerConfig) {
        this.config = config;
        if (this.config?.debug) {
            this.setDebugMode(this.config?.debug);
        }

        this.setLocalization(this.config?.locale, ['common', 'player']);

        this.init();
    }

    public setSource(source: ISource) {
        this.source = source;
        MediaApi.videoEntity = this.source.videoEntity;

        this.setLocalization(this.config?.locale, ['common', 'player']);
        if (this.loaded) {
            const playerComponent: PlayerComponent = this.shadowRoot.querySelector('media-player');
            playerComponent.cameraName = AvaAPi.videoName;
            playerComponent.init(this.source.allowCrossSiteCredentials, this.source.authenticationToken, this.allowedControllers);
        }
    }

    public setPlaybackAuthorization(token: string) {
        const playerComponent: PlayerComponent = this.shadowRoot.querySelector('media-player');

        playerComponent.setPlaybackAuthorization(token);
    }

    public set apiBase(apiBase: string) {
        AvaAPi.fallbackAPIBase = apiBase;
    }

    public async load(clipTimeRange?: IClipTimeRange) {
        this.loaded = true;
        const playerComponent: PlayerComponent = this.shadowRoot.querySelector('media-player');

        if (clipTimeRange) {
            this.clipTimeRange = clipTimeRange;
        } else {
            this.clipTimeRange = null;
        }

        // If set source state
        if (this.source) {
            playerComponent.cameraName = AvaAPi.videoName;
            playerComponent.init(this.source.allowCrossSiteCredentials, this.source.authenticationToken, this.allowedControllers);
            return;
        }
        // Configuration state - work with AVA API
        // Get video
        try {
            await AvaAPi.getVideo()
                .then(async (videoInformation) => {
                    if (videoInformation.status >= 400 && videoInformation.status < 600) {
                        this.handelFallback(new HttpError('API Error', videoInformation.status, videoInformation));
                    } else {
                        MediaApi.videoEntity = await videoInformation.json();

                        // Authorize video
                        await AvaAPi.authorize();
                        playerComponent.cameraName = AvaAPi.videoName;
                        playerComponent.init(true, '', this.allowedControllers, this.clipTimeRange, this.isMuted);
                    }
                })
                .catch((error) => {
                    Logger.log(error);
                    this.handelFallback(error);
                });
        } catch (error: unknown) {
            if (error instanceof HttpError) {
                this.handelFallback(error);
            } else {
                throw error;
            }
        }
    }

    protected init() {
        if (this.config?.token) {
            TokenHandler.tokenExpiredCallback = this.tokenExpiredCallback.bind(this);
            TokenHandler.avaAPIToken = this.config.token;
        }

        AvaAPi.clientApiEndpointUrl = this.config?.clientApiEndpointUrl;
        AvaAPi.videoName = this.config?.videoName;
        if (this._config?.debug !== undefined) {
            Logger.debugMode = !!this._config?.debug;
            const player: PlayerComponent = this.shadowRoot.querySelector('media-player');
            player.setDebugMode(Logger.debugMode);
        }
        this.allowedControllers = this.config.playerControllers;
        this.isMuted = this.config?.isMuted ?? true;
    }

    private handelFallback(error: HttpError) {
        const player: PlayerComponent = this.shadowRoot.querySelector('media-player');
        player.cameraName = AvaAPi.videoName;
        player.init(true, '', this.allowedControllers);
        player.handleError(error);
    }

    private tokenExpiredCallback() {
        this.$emit(PlayerEvents.TOKEN_EXPIRED);
    }
}
