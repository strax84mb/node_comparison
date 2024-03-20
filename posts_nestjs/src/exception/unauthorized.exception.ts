import { HttpException } from "@nestjs/common"

export class UnauthorizedException extends HttpException {
    constructor(message: string) {
        super(message, 401);
    }
}