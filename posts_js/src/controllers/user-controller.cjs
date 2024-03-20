const authServiceModule = require('../services/auth-service.cjs');
const { BadRequestException } = require('../exceptions/bad-request_exception.cjs');

/**
 * @module controllers/user-controller
 */

const idUserController = 'app-controllers-UserController';

/**
 * Controller for user resources ie. login
 */
class UserController {
    ctx;

    /**
     * @constructor
     * @param {Context} ctx 
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    __init() {}
    async __initAsync() {}

    authService;

    async __initAuthService() {
        if (!this.authService) {
            this.authService = await this.ctx.getBeanAsync(
                authServiceModule.AuthService,
                authServiceModule.idAuthService,
            );
        }
    }

    /**
     * Performs a login.
     * @param {APIGatewayProxyEvent} event 
     * @returns {LoginResponse} JWT that will last for an hour
     */
    async login(event) {
        await this.__initAuthService();
        const body = JSON.parse(event.body);
        if (!body || !body['username'] || !body['password']) {
            throw new BadRequestException('incorrect payload');
        }
        const token = await this.authService.login(body.username, body.password);
        return {
            statusCode: 200,
            body: JSON.stringify({
                'id-token': token,
            }),
        };
    }
}

module.exports = {
    idUserController: idUserController,
    UserController: UserController,
};