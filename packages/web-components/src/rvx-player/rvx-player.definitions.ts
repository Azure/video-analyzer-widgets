export type MimeType = 'video/mp4' | 'application/dash+xml' | 'application/vnd.apple.mpegurl';

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
    // LIVE = 'live',
    MUTE = 'mute',
    VOLUME = 'volume',
    SPACER = 'spacer',
    BODY_TRACKING = 'body_tracking',
    OVERFLOW_MENU = 'overflow_menu',
    FULLSCREEN = 'fullscreen',
    NEXT_DAY = 'next_day',
    PREVIOUS_DAY = 'previous_day',
    HOURS_LABEL = 'hours_label'
}

export enum LiveState {
    ON = 'live-on',
    OFF = 'live-off'
}
