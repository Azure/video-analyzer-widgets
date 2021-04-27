import { BaseWidget } from '../base-widget';
import { customElement, attr } from '@microsoft/fast-element';
import { IAvaPlayerConfig, RVXEvents } from './definitions';
import { TokenHandler } from '../../../common/services/auth/token-handler.class';
import { AvaAPi } from '../../../common/services/auth/ava-api.class';
import { MediaApi } from '../../../common/services/media/media-api.class';
import { template } from './rvx-widget.template';
import { styles } from './rvx-widget.style';
import { PlayerComponent } from '../../../web-components/src';

@customElement({
    name: 'ava-player',
    template,
    styles
})
export class Player extends BaseWidget {
    @attr public _config: IAvaPlayerConfig;
    @attr public width: string;
    @attr public height: string;

    public constructor(width: string = '', height: string = '', inputConfig: IAvaPlayerConfig) {
        super();
        this._config = inputConfig;
        this.width = width;
        this.height = height;

        if (this._config) {
            this.init();
        }
    }

    public widgetConfigChanged() {
        this.init();
    }

    public setAccessToken(token: string) {
        if (token) {
            this._config.token = token;
            TokenHandler.avaAPIToken = this._config.token;
        }
    }

    public configure(config: IAvaPlayerConfig) {
        this._config = config;
        this.init();
    }

    public set apiBase(apiBase: string) {
        AvaAPi.fallbackAPIBase = apiBase;
    }

    public async load() {
        // Get video
        try {
            await AvaAPi.getVideo()
                .then(async (videoInformation) => {
                    if (videoInformation.status >= 400 && videoInformation.status < 600) {
                        this.handelFallback();
                    } else {
                        const response = await videoInformation.json();
                        // Init media API
                        MediaApi.baseStream = response.properties.streaming.archiveBaseUrl;

                        // Authorize video
                        await AvaAPi.authorize();

                        this.initPlayer();
                    }
                })
                .catch((error: Error) => {
                    console.log(error);
                    this.handelFallback();
                });
        } catch (error) {
            console.log(error);
            this.handelFallback();
        }
    }

    private handelFallback() {
        // Init media API as fallback
        MediaApi.baseStream =
            'https://amsts71mediaarmacfgqhd-ts711.streaming.media.azure-test.net/527754db-43ab-4357-9fda-8959121d3a5e/test.ism';
        this.initPlayer();
    }

    private initPlayer() {
        const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');
        rvxPlayer.init();
    }

    private tokenExpiredCallback() {
        this.$emit(RVXEvents.TOKEN_EXPIRED);
    }

    private init() {
        if (this._config?.token) {
            TokenHandler.tokenExpiredCallback = this.tokenExpiredCallback.bind(this);
            TokenHandler.avaAPIToken = this._config.token;
        }

        AvaAPi.accountID = this._config?.accountId;
        AvaAPi.longRegionCode = this._config?.longRegionCode;
        AvaAPi.videoName = this._config?.videoName;
    }
}
