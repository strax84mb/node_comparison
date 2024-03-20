import { Bean } from "../context/context";
import { AuthService, idAuthService } from "../services/auth-service";
import { CommentService, idCommentService } from "../services/comment-service";
import { Event, Response, SaveComment, UpdateComment, commentToDto, getNumber, respond } from "./types";
import { BadRequestException } from "../exceptions/bad-request-exception";
import { ICommentHandlers } from "./i-comment-handlers";

export class CommentHandlers extends Bean implements ICommentHandlers {
    async __init() {}

    private authService: AuthService;
    private commentService: CommentService;

    private async __initAuthService() {
        if (!this.authService) {
            this.authService = await this.__ctx.getBean(idAuthService, AuthService) as AuthService;
        }
    }

    private async __initCommentService() {
        if (!this.commentService) {
            this.commentService = await this.__ctx.getBean(idCommentService, CommentService) as CommentService;
        }
    }

    async getAll(event: Event): Promise<Response> {
        const limit = getNumber(
            event.queryStringParameters?.['limit'],
            'limit must be a non-negative number',
            true,
            10,
        );
        const offset = getNumber(
            event.queryStringParameters?.['offset'],
            'offset must be a non-negative number',
            true,
            0,
        );
        await this.__initCommentService();
        const comments = await this.commentService.getAll({
            limit: limit,
            offset: offset,
        });
        return respond(200, comments.map(c => commentToDto(c)));
    }

    async getOne(event: Event): Promise<Response> {
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        await this.__initCommentService();
        const comment = await this.commentService.getById(id);
        return respond(200, commentToDto(comment));
    }

    async getAllForCity(event: Event): Promise<Response> {
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        await this.__initCommentService();
        const comments = await this.commentService.getByCityId(id);
        return respond(200, comments.map(c => commentToDto(c)));
    }

    private validateUpdateCommentBody(body: string): UpdateComment {
        const obj = JSON.parse(body);
        if (!obj || typeof obj?.text != 'string') {
            throw new BadRequestException('incorrect payload');
        }
        return {
            text: obj.text,
        };
    }

    async update(event: Event): Promise<Response> {
        await this.__initAuthService();
        const user = await this.authService.hasRights(event, ['user', 'admin']);
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        const body = this.validateUpdateCommentBody(event.body);
        await this.__initCommentService();
        await this.commentService.update(user, id, body.text);
        return respond(200);
    }

    private validateSaveCommentBody(body: string): SaveComment {
        const obj = JSON.parse(body);
        if (!obj || typeof obj?.cityId != 'number' || typeof obj?.text != 'string') {
            throw new BadRequestException('incorrect payload');
        }
        return {
            cityId: obj.cityId,
            text: obj.text,
        };
    }

    async saveNew(event: Event): Promise<Response> {
        await this.__initAuthService();
        const user = await this.authService.hasRights(event, ['user', 'admin']);
        const body = this.validateSaveCommentBody(event.body);
        await this.__initCommentService();
        await this.commentService.saveNew({
            id: null,
            cityId: body.cityId,
            text: body.text,
            userId: user.id,
            createdAt: null,
            updatedAt: null,
        });
        return respond(200);
    }

    async delete(event: Event): Promise<Response> {
        await this.__initAuthService();
        const user = await this.authService.hasRights(event, ['user', 'admin']);
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        await this.__initCommentService();
        await this.commentService.delete(user, id);
        return respond(200);
    }
}