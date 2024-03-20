const EntitySchema = require('typeorm').EntitySchema;

/**
 * @module entities/comment
 */

/**
 * Comment entity
 */
class Comment {
    /**
     * ID of comment
     * @type number
     */
    id;

    /**
     * ID of user that posted the comment
     * @type number
     */
    userId;

    /**
     * ID of city for which the comment was posted
     * @type number
     */
    cityId;

    /**
     * Content of comment
     * @type string
     */
    text;

    /**
     * @type Date
     */
    updatedAt;

    /**
     * @type Date
     */
    createdAt;

    /**
     * @constructor
     * @param {number} id 
     * @param {number} userId 
     * @param {number} cityId 
     * @param {string} text 
     * @param {Date} updatedAt 
     * @param {Date} createdAt 
     */
    constructor(id, userId, cityId, text, updatedAt, createdAt) {
        this.id = id;
        this.userId = userId;
        this.cityId = cityId;
        this.text = text;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
}

/**
 * Comment schema
 */
const commentEntitySchema = new EntitySchema({
    name: 'comments',
    tableName: 'comments',
    target: Comment,
    columns: {
        id: {
            name: 'id',
            primary: true,
            type: 'bigint',
            generated: true,
        },
        userId: {
            name: 'user_id',
            type: 'bigint',
        },
        cityId: {
            name: 'city_id',
            type: 'bigint',
        },
        text: {
            name: 'text',
            type: 'varchar',
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp',
            default: 'current_timestamp',
        },
        updatedAt: {
            name: 'updated_at',
            type: 'timestamp',
            default: 'current_timestamp',
        },
    },
});

module.exports = {
    Comment: Comment,
    commentEntitySchema: commentEntitySchema,
};