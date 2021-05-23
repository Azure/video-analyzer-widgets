import { HttpError, StatusCodes } from '../../../common/utils/http.error';

export function getPlayerErrorString(error: HttpError) {
    switch (error?.code) {
        case StatusCodes.BAD_REQUEST: {
            return 'Account ID missing in host name';
        }
        case StatusCodes.FORBIDDEN: {
            return 'Access forbidden';
        }
        case StatusCodes.NOT_FOUND: {
            return 'The requested resource was not found';
        }
        case StatusCodes.PRECONDITION_FAILED: {
            return error.message || 'Invalid Action';
        }
        default:
            return error.message || 'Unknown Error';
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getShakaPlayerErrorString(error: any) {
    switch (error?.detail.category) {
        case 1: {
            // shaka_player.util.Error.Category.NETWORK
            return 'Errors from the network stack.';
        }
        case 3: {
            // shaka_player.util.Error.Category.MEDIA
            return 'Errors parsing or processing audio or video streams.';
        }
        case 4: {
            // shaka_player.util.Error.Category.MANIFEST
            return 'Errors parsing the Manifest.';
        }
        case 5: {
            // shaka_player.util.Error.Category.STREAMING
            return 'Errors related to streaming.';
        }
        case 9: {
            // shaka_player.util.Error.Category.STORAGE
            return 'Errors in the database storage (offline).';
        }
        default:
            return 'Unknown Error';
    }
}
