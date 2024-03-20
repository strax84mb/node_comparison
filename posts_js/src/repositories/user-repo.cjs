const ds = require('./data-source.cjs');
const entity = require('../entities/user.cjs');
const { NotFoundException } = require('../exceptions/not-found_exception.cjs');
const md5 = require('md5');

const idUserRepository = 'app-repositories-UserRepository';

class UserRepository {
    ctx;

    /**
     * @constructor
     * @param {context/context.cjs/Context} ctx 
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * Repository of type User
     * @type Repository<User>
     */
    repo;

    async __initAsync() {
        const dataSource = await this.ctx.getBeanAsync(ds.MySqlDataSource, ds.idMySqlDataSource);
        this.repo = dataSource.dataSource.getRepository(entity.User);
    }

    getById(id) {
        return this.repo.findOne({
            where: [
                { id: id },
            ],
        });
    }

    getByEmail(email) {
        return this.repo.findOne({
            where: [
                { email: email },
            ],
        });
    }

    getByEmailAndPassword(email, password) {
        const pass = md5(password);
        return this.repo.findOne({
            where: [
                { 
                    email: email,
                    password: pass,
                },
            ],
        });
    }
}

module.exports = {
    idUserRepository: idUserRepository,
    UserRepository: UserRepository,
};