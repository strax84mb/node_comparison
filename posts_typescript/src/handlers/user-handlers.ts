import { BadRequestException } from "../exceptions/bad-request-exception";
import { Bean } from "../context/context";
import { AuthService, idAuthService } from "../services/auth-service";
import { Event, LoginUserDto, Response, respond } from "./types";
import { IUserHandlers } from "./i-user-handlers";

export class UserHandlers extends Bean implements IUserHandlers {
    async __init() {}

    private authService: AuthService;

    private async __initAuthService() {
        if (!this.authService) {
            this.authService = await this.__ctx.getBean(idAuthService, AuthService) as AuthService;
        }
    }

    private validateLoginBody(body: string): LoginUserDto {
        const obj = JSON.parse(body);
        if (!obj || typeof obj?.username != 'string' || typeof obj?.password != 'string') {
            throw new BadRequestException('incorrect payload');
        }
        return {
            username: obj.username,
            password: obj.password,
        };
    }

    async login(event: Event): Promise<Response> {
        const body = this.validateLoginBody(event.body);
        await this.__initAuthService();
        const token = await this.authService.login(body.username, body.password);
        return respond(200, { token: token });
    }
}