export enum ExceptionType {
    Internal = 'INTERNAL',
    BadRequest = 'BAD_REQUEST',
    Unauthorized = 'UNAUTHORIZED',
    Forbidden = 'FORBIDDEN',
    NotFound = 'NOT_FOUND',
}

export class BaseException {

    type: ExceptionType;
    message: string;

    constructor(type: ExceptionType, message: string) {
        this.type = type;
        this.message = message;
    }

    getHttpStatusCode(): number {
        switch (this.type) {
            case ExceptionType.Internal: return 500;
            case ExceptionType.BadRequest: return 400;
            case ExceptionType.Unauthorized: return 401;
            case ExceptionType.Forbidden: return 403;
            case ExceptionType.NotFound: return 404;
            default: return 500;
        }
    }
}