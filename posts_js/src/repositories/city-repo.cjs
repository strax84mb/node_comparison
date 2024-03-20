const ds = require('./data-source.cjs');
const City = require('../entities/city.cjs').City;
const InternalServerErrorException = require('../exceptions/internal-server-error_exception.cjs').InternalServerErrorException;

/**
 * @module repositories/city-repo
 */

/**
 * Unique ID for CityRepository bean
 */
const idCityRepository = 'app-repositories-CityRepository';

/**
 * Repository for CRUD operations with City entity
 */
class CityRepository {
    ctx;

    /**
     * @constructor
     * @param {context/context.cjs/Context} ctx 
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * Repository of type City
     * @type Repository<City>
     */
    repo;

    /**
     * Initiate field <b>repo</b>
     */
    async __initAsync() {
        const dataSource = await this.ctx.getBeanAsync(ds.MySqlDataSource, ds.idMySqlDataSource);
        this.repo = dataSource.dataSource.getRepository(City);
    }

    /**
     * Get all cities in DB with respect to pagination
     * @param {PaginatedRepoInput} input 
     * @returns {City[]} City[]
     */
    getAll(input) {
        return this.repo.find({
            take: input.limit,
            skip: input.offset,
        });
    }

    /**
     * Get city by ID
     * @param {number} id 
     * @returns {City} City or null
     */
    findById(id) {
        return this.repo.findOne({
            where: [
                { id: id },
            ],
        });
    }

    /**
     * Delete city with given ID
     * @param {number} id 
     * @returns {number} Number of deleted rows
     */
    async deleteById(id) {
        const result = await this.repo
            .createQueryBuilder()
            .delete()
            .where('id = :id', { id: id})
            .execute();
        return result.affected;
    }

    /**
     * Update name of the city for given id
     * @param {City} city 
     * @returns {City} Updated city or null if city not found
     */
    async update(city) {
        const result = await this.repo.createQueryBuilder()
            .update()
            .set({ name: city.name })
            .where('id = :id', { id: city.id})
            .execute();
        if (result.affected) {
            return city;
        } else {
            return null;
        }
    }

    /**
     * Save new city
     * @param {string} name
     * @throws InternalServerErrorException - when nothing is saved
     */
    async save(name) {
        const result = await this.repo.createQueryBuilder()
            .insert()
            .values([
                { name: name }
            ]).execute();
        if (!result.affected) {
            throw new InternalServerErrorException('nothing was saved')
        }
    }
}

module.exports = {
    idCityRepository: idCityRepository,
    CityRepository: CityRepository,
};