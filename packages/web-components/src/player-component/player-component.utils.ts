import { HttpError, StatusCodes } from '../../../common/utils/http.error';
import { Localization } from './../../../common/services/localization/localization.class';

export function getPlayerErrorString(error: HttpError) {
    switch (error?.code) {
        case StatusCodes.BAD_REQUEST: {
            return Localization.dictionary.PLAYER_UTILS_BAD_REQUEST;
        }
        case StatusCodes.FORBIDDEN: {
            return Localization.dictionary.PLAYER_UTILS_FORBIDDEN;
        }
        case StatusCodes.NOT_FOUND: {
            return Localization.dictionary.PLAYER_UTILS_NOT_FOUND;
        }
        case StatusCodes.PRECONDITION_FAILED: {
            return error.message || Localization.dictionary.PLAYER_UTILS_PRECONDITION_FAILED;
        }
        default:
            return error.message || Localization.dictionary.PLAYER_UTILS_UnknownError;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getShakaPlayerErrorString(error: any) {
    switch (error?.detail.category) {
        case 1: {
            // shaka_player.util.Error.Category.NETWORK
            return Localization.dictionary.PLAYER_UTILS_ShakaError_Network;
        }
        case 3: {
            // shaka_player.util.Error.Category.MEDIA
            return Localization.dictionary.PLAYER_UTILS_ShakaError_Media;
        }
        case 4: {
            // shaka_player.util.Error.Category.MANIFEST
            return Localization.dictionary.PLAYER_UTILS_ShakaError_Manifest;
        }
        case 5: {
            // shaka_player.util.Error.Category.STREAMING
            return Localization.dictionary.PLAYER_UTILS_ShakaError_Streaming;
        }
        case 9: {
            // shaka_player.util.Error.Category.STORAGE
            return Localization.dictionary.PLAYER_UTILS_ShakaError_Storage;
        }
        default:
            return Localization.dictionary.PLAYER_UTILS_UnknownError;
    }
}
