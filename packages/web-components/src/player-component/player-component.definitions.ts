export type MimeType = 'video/mp4' | 'application/dash+xml' | 'application/vnd.apple.mpegurl' | 'application/rtsp';

export interface ISource {
    // Authentication Token for the player.
    authenticationToken?: string;

    // Mime type
    type?: MimeType;

    // allow cross site credentials
    allowCrossSiteCredentials?: boolean;

    // archive Source Url
    archiveSrc: string;

    // RTSP Source Url
    rtspSrc: string;
}

export enum ControlPanelElements {
    REWIND = 'rewind',
    PLAY_PAUSE = 'play_pause',
    FAST_FORWARD = 'fast_forward',
    LIVE = 'live',
    MUTE = 'mute',
    VOLUME = 'volume',
    SPACER = 'spacer',
    META_DATA_LAYER = 'meta_data_layer',
    OVERFLOW_MENU = 'overflow_menu',
    FULLSCREEN = 'fullscreen',
    NEXT_DAY = 'next_day',
    PREVIOUS_DAY = 'previous_day',
    HOURS_LABEL = 'hours_label',
    NEXT_SEGMENT = 'next_segment',
    PREV_SEGMENT = 'prev_segment',
    DATE_PICKER = 'date_picker',
    CAMERA_NAME = 'camera_name',
    TIMESTAMP = 'timestamp',
    TIMELINE_ZOOM = 'timeline_zoom',
    Time_And_Duration = 'time_and_duration',
    META_DATA = 'meta_data_button'
}

export enum LiveState {
    ON = 'live-on',
    OFF = 'live-off'
}

export const ControlPanelElementsTooltip = {
    REWIND: 'Rewind',
    PLAY: 'Play',
    PAUSE: 'Pause',
    FAST_FORWARD: 'Fast forward',
    LIVE: 'Live',
    MUTE: 'Mute',
    UNMUTE: 'Unmute',
    VOLUME: 'Volume',
    SPACER: 'Spacer',
    META_DATA_LAYER_ON: 'Turn on object metadata overlay',
    META_DATA_LAYER_OFF: 'Turn off object metadata overlay',
    OVERFLOW_MENU: 'More options',
    META_DATA_OVERFLOW_MENU: 'Metadata rendering',
    FULLSCREEN: 'Enter fullscreen',
    EXIT_FULLSCREEN: 'Exit fullscreen',
    NEXT_DAY: 'Next day',
    PREVIOUS_DAY: 'Previous day',
    HOURS_LABEL: 'Hours'
};
