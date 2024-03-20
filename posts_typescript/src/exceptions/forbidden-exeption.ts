import { BaseException, ExceptionType } from "./base-exception";

export class ForbiddenException extends BaseException {

    constructor(message: string) {
        super(ExceptionType.Forbidden, message);
    }
}