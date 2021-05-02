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
