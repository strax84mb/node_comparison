import { PaginationInput } from "../util/types";
import { Bean } from "../context/context";
import { CommentRepository, idCommentRepository } from "../repositories/comment-repo";
import { Comment } from "../entities/comment";
import { NotFoundException } from '../exceptions/not-found-exception';
import { User } from "../entities/user";
import { ForbiddenException } from "../exceptions/forbidden-exeption";

export const idCommentService = 'app-services-CommentService';

export class CommentService extends Bean {
    async __init() {}

    private commentRepo: CommentRepository;

    async __initCommentRepo() {
        if (!this.commentRepo) {
            this.commentRepo = await this.__ctx.getBean(idCommentRepository, CommentRepository) as CommentRepository;
        }
    }

    async getAll(input: PaginationInput): Promise<Comment[]> {
        await this.__initCommentRepo();
        return await this.commentRepo.find(input);
    }

    async getById(id: number): Promise<Comment> {
        await this.__initCommentRepo();
        const comment = await this.commentRepo.findById(id);
        if (!comment) {
            throw new NotFoundException('comment not found');
        }
        return comment;
    }

    async getByCityId(cityId: number): Promise<Comment[]> {
        await this.__initCommentRepo();
        return await this.commentRepo.findByCityId(cityId);
    }

    async saveNew(comment: Comment) {
        await this.__initCommentRepo();
        await this.commentRepo.insert(comment);
    }

    async update(user: User, id: number, text: string) {
        await this.__initCommentRepo();
        const comment = await this.commentRepo.findById(id);
        if (comment.userId != user.id) {
            throw new ForbiddenException('only poster can update a comment');
        }
        comment.text = text;
        const affected = await this.commentRepo.update(comment);
        if (!affected) {
            throw new NotFoundException('comment not found');
        }
    }

    async delete(user: User, id: number) {
        await this.__initCommentRepo();
        const comment = await this.commentRepo.findById(id);
        if (!comment) {
            throw new NotFoundException('comment not found');
        }
        if (user.rolesList.includes('admin') || comment.userId != user.id) {
            throw new ForbiddenException('only poster or admin can delete a comment');
        }
        const affected = await this.commentRepo.deleteById(id);
        if (!affected) {
            throw new NotFoundException('comment not found');
        }
    }
}