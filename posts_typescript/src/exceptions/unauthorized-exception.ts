import { BaseException, ExceptionType } from "./base-exception";

export class UnauthorizedException extends BaseException {

    constructor(message: string) {
        super(ExceptionType.Unauthorized, message);
    }
}