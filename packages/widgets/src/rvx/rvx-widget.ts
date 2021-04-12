import { BaseWidget } from '../base-widget';
import { customElement, attr } from '@microsoft/fast-element';
import { IRVXWidgetConfig } from './definitions';
import { TokenHandler } from '../../../common/services/auth/token-handler.class';
import { AvaAPi } from '../../../common/services/auth/ava-api.class';
import { MediaApi } from '../../../common/services/media/media-api.class';
import { template } from './rvx-widget.template';
import { styles } from './rvx-widget.style';
import { PlayerComponent } from '../../../web-components/src';

@customElement({
    name: 'rvx-widget',
    template,
    styles
})
export class RVXWidget extends BaseWidget {
    @attr public widgetConfig: IRVXWidgetConfig;
    @attr public width: string;
    @attr public height: string;

    public constructor(width: string = '', height: string = '', config: IRVXWidgetConfig) {
        super();
        this.widgetConfig = config;
        this.width = width;
        this.height = height;

        if (this.widgetConfig) {
            this.init();
        }
    }

    public widgetConfigChanged() {
        this.init();
    }

    private async init() {
        if (this.widgetConfig?.token) {
            TokenHandler.avaAPIToken = this.widgetConfig.token;
        }

        AvaAPi.accountID = this.widgetConfig?.accountId;
        AvaAPi.longRegionCode = this.widgetConfig?.longRegionCode;
        AvaAPi.videoName = this.widgetConfig?.videoName;

        // Get video
        const videoInformation = await AvaAPi.getVideo();

        const response = await videoInformation.json();
        // Authorize video
        await AvaAPi.authorize();

        // Init media API
        MediaApi.baseStream =
            'https://amsts71mediaarmacfgqhd-ts711.streaming.media.azure-test.net/527754db-43ab-4357-9fda-8959121d3a5e/test.ism';

        const rvxPlayer: PlayerComponent = this.shadowRoot.querySelector('rvx-player');
        rvxPlayer.init();
    }
}
