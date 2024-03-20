const { commentToDto } = require('../dtos/comment.cjs');
const { CommentService, idCommentService } = require('../services/comment-service.cjs');
const { AuthService, idAuthService } = require('../services/auth-service.cjs');
const { getNumber } = require('./utils.cjs');

const idCommentController = 'app-controllers-CommentController';

/**
 * Controller for comment resources
 */
class CommentController {
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

    commentService;
    authService;

    async __initCommentService() {
        if (!this.commentService) {
            this.commentService = await this.ctx.getBeanAsync(CommentService, idCommentService);
        }
    }

    async __initAuthService() {
        if (!this.authService) {
            this.authService = await this.ctx.getBeanAsync(AuthService, idAuthService);
        }
    }

    /**
     * Get all comments
     * @param {APIGatewayProxyEvent} event 
     * @returns {CommentDto[]} CommentDto[]
     */
    async getAll(event) {
        const limit = getNumber(
            event && event.queryStringParameters && event.queryStringParameters.limit,
            'limit must be a non-negative number',
            false,
            10);
        const offset = getNumber(
            event && event.queryStringParameters && event.queryStringParameters.offset,
            'offset must be a non-negative number',
            false,
            0);
            await this.__initCommentService();
            const comments = await this.commentService.getAll({
            limit: limit,
            offset: offset,
        });
        return {
            statusCode: 200,
            body: JSON.stringify(comments.map(c => commentToDto(c))),
        };
    }

    /**
     * Get single comment
     * @param {APIGatewayProxyEvent} event 
     * @returns {CommentDto} Comment with given ID
     */
    async getOne(event) {
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = requestUtils.getNumber(idParam, 'id must be a non-negative number', true);
        await this.__initCommentService();
        const comment = await this.commentService.getOne(id);
        return {
            statusCode: 200,
            body: JSON.stringify(commentToDto(comment)),
        };
    }

    /**
     * Get all comments for a city
     * @param {APIGatewayProxyEvent} event 
     * @returns {CommentDto[]} CommentDto[]
     */
    async getAllForCity(event) {
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = requestUtils.getNumber(idParam, 'id must be a non-negative number', true);
        await this.__initCommentService();
        const comments = await this.commentService.getAllForCity(id);
        return {
            statusCode: 200,
            body: JSON.stringify(comments.map(c => commentToDto(c))),
        };
    }

    /**
     * Deletes a comment with given ID
     * @param {APIGatewayProxyEvent} event 
     */
    async delete(event) {
        await this.__initAuthService();
        const user = this.authService.userHasRoles(event, ['user', 'admin']);;
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = requestUtils.getNumber(idParam, 'id must be a non-negative number', true);
        await this.__initCommentService();
        await this.commentService.delete(user, id);
        return { statusCode: 200 };
    }

    /**
     * Update comment
     * @param {APIGatewayProxyEvent} event 
     */
    async update(event) {
        await this.__initAuthService();
        const user = this.authService.userHasRoles(event, ['user', 'admin']);;
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = requestUtils.getNumber(idParam, 'id must be a non-negative number', true);
        const body = JSON.parse(event.body);
        if (!body.text || !body.cityId) {
            throw new BadRequestException('incorrect payload');
        }
        body.id = id;
        await this.__initCommentService();
        await this.commentService.update(body, user);
        return { statusCode: 200 };
    }

    /**
     * Save new comment
     * @param {APIGatewayProxyEvent} event 
     */
    async saveNew(event) {
        await this.__initAuthService();
        const user = this.authService.userHasRoles(event, ['user', 'admin']);;
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = requestUtils.getNumber(idParam, 'id must be a non-negative number', true);
        const body = JSON.parse(event.body);
        if (!body.text || !body.cityId) {
            throw new BadRequestException('incorrect payload');
        }
        body.cityId = id;
        await this.__initCommentService();
        await this.commentService.saveNew(body, user);
        return { statusCode: 200 };
    }
}

module.exports = {
    idCommentController: idCommentController,
    CommentController: CommentController,
};