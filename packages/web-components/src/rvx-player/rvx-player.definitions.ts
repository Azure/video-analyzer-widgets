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

export enum ControlPanelElementsTooltip {
    REWIND = 'Rewind',
    PLAY = 'Play',
    PAUSE = 'Pause',
    FAST_FORWARD = 'Fast forward',
    LIVE = 'Live',
    MUTE = 'Mute',
    UNMUTE = 'Unmute',
    VOLUME = 'Volume',
    SPACER = 'Spacer',
    BODY_TRACKING_ON = 'Turn on object metadata overlay',
    BODY_TRACKING_OFF = 'Turn off object metadata overlay',
    OVERFLOW_MENU = 'More options',
    FULLSCREEN = 'Enter fullscreen',
    EXIT_FULLSCREEN = 'Exit fullscreen',
    NEXT_DAY = 'Next day',
    PREVIOUS_DAY = 'Previous day',
    HOURS_LABEL = 'Hours'
}
