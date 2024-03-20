const EntitySchema = require('typeorm').EntitySchema;

/**
 * @module entities/user
 */

/**
 * User entity
 */
class User {
    /**
     * Id of user
     * @type number
     */
    id;

    /**
     * E-mail
     * @type string
     */
    email;

    /**
     * Password
     * @type string
     */
    password;

    /**
     * Comma separated list of roles
     * @type string
     */
    roles;

    /**
     * List of roles assigned to user
     * @type Array<string>
     */
    rolesList;

    /**
     * @constructor
     * @param {number} id 
     * @param {string} email 
     * @param {string} pass 
     * @param {string} roles 
     */
    constructor(id, email, pass, roles) {
        this.id = id;
        this.email = email;
        this.password = pass;
        this.roles = roles;
        this.expandRoles();
    }

    /**
     * Joins all the roles from <b>roles</b> into comma separated list and saves it to <b>rolesList</b>
     */
    compactRoles() {
        if (this.rolesList) {
            this.roles = this.roles.join(',');
        } else if (this.roles) {
            delete this.roles;
        }
    }

    /**
     * Splits comma separated list from <b>roles</b> and saves array to <b>rolesList</b>
     */
    expandRoles() {
        if (this.roles) {
            this.rolesList = this.roles.split(',');
        } else if (this.rolesList) {
            delete this.rolesList;
        }
    }
}

const userEntitySchema = new EntitySchema({
    name: 'users',
    tableName: 'users',
    target: User,
    columns: {
        id: {
            name: 'id',
            primary: true,
            type: 'bigint',
            generated: true,
        },
        email: {
            name: 'email',
            type: 'varchar',
        },
        password: {
            name: 'pass',
            type: 'varchar',
        },
        roles: {
            name: 'roles',
            type: 'varchar',
        },
    },
});

module.exports = {
    User: User,
    userEntitySchema: userEntitySchema,
};