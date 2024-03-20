const { Comment } = require('../entities/comment.cjs');
const { MySqlDataSource, idMySqlDataSource } = require('./data-source.cjs');
const { InternalServerErrorException } = require('../exceptions/internal-server-error_exception.cjs');

const idCommentRepository = 'app-repositories-CommentRepository';

/**
 * Repository for comment entities
 */
class CommentRepository {
    ctx;

    /**
     * @constructor
     * @param {Context} ctx 
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    repo;

    __init() {}

    async __initAsync() {
        const dataSource = await this.ctx.getBeanAsync(MySqlDataSource, idMySqlDataSource);
        this.repo = dataSource.dataSource.getRepository(Comment);
    }

    /**
     * Get all comments in DB with respect to pagination
     * @param {PaginatedRepoInput} input 
     * @returns {Comment[]} Comment[]
     */
    find(input) {
        return this.repo.find({
            take: input.limit,
            skip: input.offset,
        });
    }

    /**
     * Get comment with given ID
     * @param {number} id 
     * @returns {Comment} Comment
     */
    findById(id) {
        return this.repo.createQueryBuilder()
            .where('id = :id', { id: id })
            .getMany();
    }

    /**
     * Get comments for city
     * @param {number} cityId 
     * @returns {Comment[]} Comment[]
     */
    findByCity(cityId) {
        return this.repo.createQueryBuilder()
            .where('city_id = :cityId', { cityId: cityId })
            .getMany();
    }

    /**
     * Get comments posted by user
     * @param {number} userId 
     * @returns {Comment[]} Comment[]
     */
    findByUser(userId) {
        return this.repo.createQueryBuilder()
            .where('user_id = :userId', { userId: userId })
            .getMany();
    }

    /**
     * 
     * @param {Comment} comment 
     * @returns {Comment} Updated comment
     */
    async update(comment) {
        comment.updatedAt = new Date();
        const result = await this.repo
            .createQueryBuilder()
            .set({
                text: comment.text,
                city_id: comment.cityId,
                updated_at: comment.updatedAt,
            })
            .where('id = :id', { id: comment.id})
            .execute();
        if (result.affected) {
            return comment;
        } else {
            return null;
        }
    }

    /**
     * Save new comment
     * @param {Comment} comment 
     */
    async insert(comment) {
        comment.createdAt = new Date();
        comment.updatedAt = new Date();
        const result = await this.repo
            .createQueryBuilder()
            .insert()
            .values([
                {
                    user_id: comment.userId,
                    city_id: comment.cityId,
                    text: comment.text,
                    created_at: comment.createdAt,
                    updated_at: comment.updatedAt,
                },
            ])
            .execute();
        if (!result.affected) {
            throw new InternalServerErrorException('nothing was saved');
        }
    }

    /**
     * Delete comment with given ID
     * @param {number} id 
     * @returns {number} Number of deleted rows
     */
    async delete(id) {
        const result = await this.repo
            .createQueryBuilder()
            .delete()
            .where('id = :id', { id: id })
            .execute();
        return result.affected;
    }

    /**
     * Delete comment with given user ID
     * @param {number} userId 
     * @returns {number} Number of deleted rows
     */
    async deleteForUser(userId) {
        const result = await this.repo
            .createQueryBuilder()
            .delete()
            .where('user_id = :userId', { userId: userId })
            .execute();
        return result.affected;
    }

    /**
     * Delete comment with given city ID
     * @param {number} cityId 
     * @returns {number} Number of deleted rows
     */
    async deleteForCity(cityId) {
        const result = await this.repo
            .createQueryBuilder()
            .delete()
            .where('city_id = :cityId', { cityId: cityId })
            .execute();
        return result.affected;
    }
}

module.exports = {
    CommentRepository: CommentRepository,
    idCommentRepository: idCommentRepository,
};