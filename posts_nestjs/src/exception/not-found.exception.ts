import { HttpException } from "@nestjs/common";

export class NotFoundException extends HttpException {
    constructor(message: string){
        super(message, 404);
    }
}