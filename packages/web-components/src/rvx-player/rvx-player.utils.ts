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
