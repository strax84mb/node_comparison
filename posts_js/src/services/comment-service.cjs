const { idCommentRepository, CommentRepository } = require('../repositories/comment-repo.cjs');
const { NotFoundException } = require('../exceptions/not-found_exception.cjs');
const { ForbidenException } = require('../exceptions/forbiden_exception.cjs');
const { InternalServerErrorException } = require('../exceptions/internal-server-error_exception.cjs');

const idCommentService = 'app-services-CommentService';

/**
 * Service for comment resources
 */
class CommentService {
    ctx;

    /**
     * @constructor
     * @param {Context} ctx 
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    commentRepo;

    async __initCommentRepo() {
        if (!this.commentRepo) {
            this.commentRepo = await this.ctx.getBeanAsync(CommentRepository, idCommentRepository);
        }
    }

    /**
     * Get all comments
     * @param {PaginatedRepoInput} input 
     * @returns {Comment[]} Comment[]
     */
    async getAll(input) {
        return await this.commentRepo.find(input);
    }

    /**
     * Get comment with given ID
     * @param {number} id 
     * @returns {Comment} Comment
     * @throws NotFoundException
     */
    async getOne(id) {
        const comment = await this.commentRepo.findById(id);
        if (!comment) {
            throw new NotFoundException('comment not found');
        }
        return comment;
    }

    /**
     * Get all comments posted for the city
     * @param {number} cityId 
     * @returns {Comment[]} Comment[]
     */
    async getAllForCity(cityId) {
        return await this.commentRepo.findByCity(cityId);
    }

    /**
     * Deletes a comment
     * @param {User} user 
     * @param {number} id ID of comment
     * @throws NotFoundException
     * @throws ForbidenException
     * @throws InternalServerErrorException
     */
    async delete(user, id) {
        if (!user.rolesList.includes('admin')) {
            const comment = this.getOne(id);
            if (comment.userId != user.id) {
                throw new ForbidenException('only comment poster and admin can delete comment');
            }
        }
        const affected = await this.commentRepo.delete(id);
        if (!affected) {
            throw new InternalServerErrorException('failed to delete comment event though rights are sufficient');
        }
    }

    /**
     * Updates a comment
     * @param {Comment} commentToUpdate 
     * @param {User} user 
     * @throws NotFoundException
     * @throws ForbidenException
     * @throws InternalServerErrorException
     */
    async update(commentToUpdate, user) {
        const comment = this.getOne(comment.id);
        if (comment.userId != user.id) {
            throw new ForbidenException('only comment poster can alter comment');
        }
        const affected = await this.commentRepo.update(commentToUpdate);
        if (!affected) {
            throw new InternalServerErrorException('failed to update comment event though rights are sufficient');
        }
    }

    /**
     * Saves new comment
     * @param {Comment} comment 
     * @param {User} user 
     * @throws InternalServerErrorException
     */
    async saveNew(comment, user) {
        comment.userId = user.id;
        await this.commentRepo.insert(comment);
    }
}

module.exports = {
    idCommentService: idCommentService,
    CommentService: CommentService,
};