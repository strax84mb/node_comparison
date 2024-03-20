/**
 * @module repositories/airport-repo
 */

const ds = require('./data-source.cjs');
const Airport = require('../entities/airport.cjs').Airport;
const InternalServerErrorException = require('../exceptions/internal-server-error_exception.cjs').InternalServerErrorException;

const idAirportRepository = 'app-repositories-AirportRepository';

/**
 * Repository for Airport entity.
 */
class AirportRepository {
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
        const dataSource = await this.ctx.getBeanAsync(ds.MySqlDataSource, ds.idMySqlDataSource);
        this.repo = dataSource.dataSource.getRepository(Airport);
    }

    /**
     * Get all airports
     * @param {PaginatedRepoInput} input
     * @returns {Airport[]} Airport[] 
     */
    find(input) {
        return this.repo.find({
            take: input.limit,
            skip: input.offset,
        });
    }

    /**
     * Get single airport
     * @param {number} id 
     * @returns {Airport} Airport
     */
    findById(id) {
        return this.repo.findOne({
            where: [
                { id: id },
            ],
        });
    }

    /**
     * Get all airports located in the city
     * @param {number} cityId 
     * @returns {Airport[]} Airport[]
     */
    findByCityId(cityId) {
        return this.repo.find({
            where: [
                { city_id: cityId },
            ],
        });
    }

    /**
     * Updates airport entity
     * @param {Airport} airport 
     * @returns {Airport} Updated entity
     */
    async update(airport) {
        const result = await this.repo.createQueryBuilder()
            .update()
            .set({
                name: airport.name,
                city_id: airport.cityId,
            })
            .where('id = :id', { id: airport.id})
            .execute();
        if (result.affected) {
            return airport;
        } else {
            return null;
        }
    }

    /**
     * Deletes single airport
     * @param {number} id 
     * @returns {number} Number of affected rows in DB
     */
    async delete(id) {
        const result = await this.repo
            .createQueryBuilder()
            .delete()
            .where('id = :id', { id: id})
            .execute();
        return result.affected;
    }

    /**
     * Delete all cities located in the city
     * @param {number} cityId 
     * @returns {number} Number of affected rows in DB
     */
    async deleteForCity(cityId) {
        const result = await this.repo
            .createQueryBuilder()
            .delete()
            .where('city_id = :cityId', { cityId: cityId})
            .execute();
        return result.affected;
    }

    /**
     * Saves new airport to DB
     * @param {Airport} airport
     * @throws InternalServerErrorException
     */
    async insert(airport) {
        const result = await this.repo.createQueryBuilder()
            .insert()
            .values([
                { 
                    name: airport.name,
                    city_id: airport.cityId,
                }
            ]).execute();
        if (!result.affected) {
            throw new InternalServerErrorException('nothing was saved')
        }
    }
}

module.exports = {
    AirportRepository: AirportRepository,
    idAirportRepository: idAirportRepository,
};