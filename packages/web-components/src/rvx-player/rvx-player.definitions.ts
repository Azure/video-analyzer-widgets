export type MimeType = 'video/mp4' | 'application/dash+xml' | 'application/vnd.apple.mpegurl';
import { Localization } from './../../../common/services/localization/localization.class';

export interface ISource {
    // Authentication Token for the player.
    authenticationToken?: string;

    // Mime type
    type?: MimeType;

    // allow cross site credentials
    allowCrossSiteCredentials?: boolean;

    // Source Url
    src: string;
}

export enum ControlPanelElements {
    REWIND = 'rewind',
    PLAY_PAUSE = 'play_pause',
    FAST_FORWARD = 'fast_forward',
    LIVE = 'live',
    MUTE = 'mute',
    VOLUME = 'volume',
    SPACER = 'spacer',
    BODY_TRACKING = 'body_tracking',
    OVERFLOW_MENU = 'overflow_menu',
    FULLSCREEN = 'fullscreen',
    NEXT_DAY = 'next_day',
    PREVIOUS_DAY = 'previous_day',
    HOURS_LABEL = 'hours_label',
    NEXT_SEGMENT = 'next_segment',
    PREV_SEGMENT = 'prev_segment'
}

export enum LiveState {
    ON = 'live-on',
    OFF = 'live-off'
}

export const ControlPanelElementsTooltip = {
    REWIND: Localization.dictionary.PLAYER_Tooltip_Rewind,
    PLAY: Localization.dictionary.PLAYER_Tooltip_Play,
    PAUSE: Localization.dictionary.PLAYER_Tooltip_Pause,
    FAST_FORWARD: Localization.dictionary.PLAYER_Tooltip_FastForward,
    LIVE: Localization.dictionary.PLAYER_Tooltip_Live,
    MUTE: Localization.dictionary.PLAYER_Tooltip_Mute,
    UNMUTE: Localization.dictionary.PLAYER_Tooltip_Unmute,
    VOLUME: Localization.dictionary.PLAYER_Tooltip_Volume,
    SPACER: Localization.dictionary.PLAYER_Tooltip_Spacer,
    BODY_TRACKING_ON: Localization.dictionary.PLAYER_Tooltip_TurnOnMetadata,
    BODY_TRACKING_OFF: Localization.dictionary.PLAYER_Tooltip_TurnOffMetadata,
    OVERFLOW_MENU: Localization.dictionary.PLAYER_Tooltip_MoreOptions,
    FULLSCREEN: Localization.dictionary.PLAYER_Tooltip_EnterFullscreen,
    EXIT_FULLSCREEN: Localization.dictionary.PLAYER_Tooltip_ExitFullscreen,
    NEXT_DAY: Localization.dictionary.PLAYER_Tooltip_NextDay,
    PREVIOUS_DAY: Localization.dictionary.PLAYER_Tooltip_PreviousDay,
    HOURS_LABEL: Localization.dictionary.PLAYER_Tooltip_Hours
}
