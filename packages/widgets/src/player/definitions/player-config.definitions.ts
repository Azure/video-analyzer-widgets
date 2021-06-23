import { ControlPanelElements } from '../../../../web-components/src/player-component/player-component.definitions';
import { IWidgetBaseConfig } from '../../definitions/base-widget-config.definitions';

/**
 * Player config, contains basic configurations for player widget.
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

export enum PlayerEvents {
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    PLAYER_ERROR = 'PLAYER_ERROR',
    SHAKE_PLAYER_ERROR = 'SHAKE_PLAYER_ERROR'
}
