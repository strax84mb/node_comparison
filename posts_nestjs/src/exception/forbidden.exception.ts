import { HttpException } from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor(message: string) {
        super(message, 403);
    }
}