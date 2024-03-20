import { BaseException, ExceptionType } from "./base-exception";

export class BadRequestException extends BaseException {
    
    constructor(message: string) {
        super(ExceptionType.BadRequest, message);
    }
}