import { Inject, Injectable } from "@nestjs/common";
import { Comment } from "../entities/comment.entity";
import { Repository } from "typeorm";
import { PaginatedInput } from "../util/types";
import { User } from "../entities/user.entity";
import { NotFoundException } from "../exception/not-found.exception";
import { ForbiddenException } from "../exception/forbidden.exception";

@Injectable()
export class CommentService {
    constructor(
        @Inject('COMMENT_REPOSITORY') private commentRepo: Repository<Comment>,
    ) {}

    getAll(input: PaginatedInput): Promise<Comment[]> {
        return this.commentRepo.find({
            skip: input.offset,
            take: input.limit,
        });
    }

    async getById(id: number): Promise<Comment> {
        const comment = await this.commentRepo.findOne({
            where: {
                id: id,
            },
        });
        if (!comment) {
            throw new NotFoundException('comment not found');
        }
        return comment;
    }

    async saveNew(user: User, cityId: number, text: string) {
        const comment = new Comment();
        comment.cityId = cityId;
        comment.text = text;
        comment.createdAt = new Date();
        comment.updatedAt = new Date();
        comment.userId = user.id;
        await this.commentRepo.insert(comment);
    }

    async update(user: User, id: number, text: string) {
        const comment = await this.commentRepo.findOne({
            where: {
                id: id,
            },
        });
        if (user.id != comment.userId) {
            throw new ForbiddenException('only poster can change its comment');
        }
        comment.text = text;
        comment.updatedAt = new Date();
        await this.commentRepo.save(comment);
    }

    async delete(user: User, id: number) {
        const comment = await this.commentRepo.findOne({
            where: {
                id: id,
            },
        });
        if (user.id != comment.userId && user.rolesList.includes('admin')) {
            throw new ForbiddenException('only poster or admin can delete a comment');
        }
        await this.commentRepo.delete(comment);
    }
}