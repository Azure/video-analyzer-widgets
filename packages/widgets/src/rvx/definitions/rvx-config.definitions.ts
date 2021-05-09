import { ControlPanelElements } from '../../../../web-components/src/rvx-player/rvx-player.definitions';
import { IWidgetBaseConfig } from '../../definitions/base-widget-config.definitions';

/**
 * RVX config, contains basic configurations for rvx widget.
 */
export interface IAvaPlayerConfig extends IWidgetBaseConfig {
    /**
     * Embedded video name
     */
    videoName: string;
    /**
     * AVA API endpoint
     */
    clientApiEndpointUrl: string;
    /**
     * AVA API token
     */
    token?: string;
    /**
     * AVA player controllers - adjust ava player controllers
     */
    playerControllers?: ControlPanelElements[];
}

export enum RVXEvents {
    TOKEN_EXPIRED = 'TOKEN_EXPIRED'
}
