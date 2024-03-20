import { BaseException, ExceptionType } from "./base-exception";

export class InternalServerErrorException extends BaseException {
    constructor(message: string) {
        super(ExceptionType.Internal, message);
    }
}