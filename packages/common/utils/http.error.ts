export class HttpError extends Error {
    public code: StatusCodes;
    public details: any;

    constructor(_message: string, _code: StatusCodes, _details: any) {
        super(_message);
        this.code = _code;
        this.details = _details;
    }
}

export enum StatusCodes {
    OK = 200,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    PRECONDITION_FAILED = 412,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501
}
