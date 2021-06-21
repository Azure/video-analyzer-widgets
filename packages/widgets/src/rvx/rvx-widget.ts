/* eslint-disable @typescript-eslint/no-unused-expressions */
import { BaseWidget } from '../base-widget';
import { customElement, attr } from '@microsoft/fast-element';
import { IAvaPlayerConfig, PlayerEvents } from './definitions';
import { TokenHandler } from '../../../common/services/auth/token-handler.class';
import { AvaAPi } from '../../../common/services/auth/ava-api.class';
import { MediaApi } from '../../../common/services/media/media-api.class';
import { template } from './rvx-widget.template';
import { styles } from './rvx-widget.style';
import { PlayerComponent } from '../../../web-components/src/rvx-player';
import { ControlPanelElements, ISource } from '../../../web-components/src/rvx-player/rvx-player.definitions';
import { Logger } from '../common/logger';
import { AvaDesignSystemProvider } from '../../../styles';
import { HttpError } from '../../../common/utils/http.error';
import { Localization } from './../../../common/services/localization/localization.class';
import { IDictionary } from '../../../common/services/localization/localization.definitions';
import { Locale } from '../definitions/locale.definitions';

AvaDesignSystemProvider;
PlayerComponent;
Localization;

export const LocalizationService = Localization;

@customElement({
    name: 'ava-player',
    template,
    styles
})
export class Player extends BaseWidget {
    @attr({ mode: 'fromView' })
    public config: IAvaPlayerConfig;
    public resources: IDictionary;
    private loaded = false;
    private source: ISource = null;
    private allowedControllers: ControlPanelElements[] = null;

    public constructor(config: IAvaPlayerConfig) {
        super(config);
        if (this.config) {
            this.init();
        }
    }

    public localize(locale: Locale) {
        LocalizationService.load(locale, ['common', 'player']);
        this.resources = LocalizationService.dictionary;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public get shakaPlayer(): any {
        const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');
        if (rvxPlayer) {
            return rvxPlayer.player?.player;
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
        const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');
        rvxPlayer.play();
    }

    public pause() {
        const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');
        rvxPlayer.pause();
    }

    public configure(config: IAvaPlayerConfig) {
        this.config = config;
        if (this.config?.debug) {
            this.setDebugMode(this.config?.debug);
        }

        if (this.config?.locale) {
            this.setLocale(this.config?.locale);
        }

        this.localize(this.config?.locale);
        this.init();
    }

    public setSource(source: ISource) {
        this.source = source;
        MediaApi.baseStream = this.source.src;
        if (this.loaded) {
            const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');
            rvxPlayer.cameraName = AvaAPi.videoName;
            rvxPlayer.init(this.source.allowCrossSiteCredentials, this.source.authenticationToken, this.allowedControllers);
        }
    }

    public widthChanged() {
        const designSystem = this.shadowRoot.querySelector('ava-design-system-provider') as AvaDesignSystemProvider;
        if (designSystem) {
            designSystem.style.width = this.width;
        }
    }

    public heightChanged() {
        const designSystem = this.shadowRoot.querySelector('ava-design-system-provider') as AvaDesignSystemProvider;
        if (designSystem) {
            designSystem.style.height = this.height;
        }
    }

    public setPlaybackAuthorization(token: string) {
        const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');

        rvxPlayer.setPlaybackAuthorization(token);
    }

    public set apiBase(apiBase: string) {
        AvaAPi.fallbackAPIBase = apiBase;
    }

    public async load() {
        this.loaded = true;
        const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');

        // If set source state
        if (this.source) {
            rvxPlayer.cameraName = AvaAPi.videoName;
            rvxPlayer.init(this.source.allowCrossSiteCredentials, this.source.authenticationToken, this.allowedControllers);
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
                        const response = await videoInformation.json();
                        // Init media API
                        MediaApi.baseStream = response.properties.streaming.archiveBaseUrl;

                        // Authorize video
                        await AvaAPi.authorize();
                        rvxPlayer.cameraName = AvaAPi.videoName;
                        rvxPlayer.init(true, '', this.allowedControllers);
                    }
                })
                .catch((error) => {
                    Logger.log(error);
                    this.handelFallback(error);
                });
        } catch (error) {
            this.handelFallback(error);
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
        }
        this.allowedControllers = this.config.playerControllers;
    }

    private handelFallback(error: HttpError) {
        const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');
        rvxPlayer.cameraName = AvaAPi.videoName;
        rvxPlayer.init(true, '', this.allowedControllers);
        rvxPlayer.handleError(error);
    }

    private tokenExpiredCallback() {
        this.$emit(PlayerEvents.TOKEN_EXPIRED);
    }
}
