import { BaseException, ExceptionType } from "./base-exception";

export class NotFoundException extends BaseException {

    constructor(message: string) {
        super(ExceptionType.NotFound, message);
    }
}