const { AirportRepository, idAirportRepository } = require('../repositories/airport-repo.cjs');
const { CityRepository, idCityRepository } = require('../repositories/city-repo.cjs');
const { CommentRepository, idCommentRepository } = require('../repositories/comment-repo.cjs');
const { NotFoundException } = require('../exceptions/not-found_exception.cjs');

/**
 * @module services/city-service
 */

/**
 * Unique ID for CityService bean
 */
const idCityService = 'app-services-CityService';

/**
 * Service for handling operations regarding cities.
 */
class CityService {
    ctx;

    /**
     * @constructor
     * @param {context/context.cjs/Context} ctx
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    __init() {}
    async __initAsync() {}

    /**
     * City repository
     * @type CityRepository
     */
    cityRepo;

    /**
     * Airport repository
     * @type AirportRepository
     */
    airportRepo;

    /**
     * Comment repository
     * @type CommentRepository
     */
    commentRepo;

    /**
     * Initiate city repository if not yet initiated.
     */
    async __initCityRepo() {
        if (!this.cityRepo) {
            this.cityRepo = await this.ctx.getBeanAsync(CityRepository, idCityRepository);
        }
    }

    async __initAirportRepo() {
        if (!this.airportRepo) {
            this.airportRepo = await this.ctx.getBeanAsync(AirportRepository, idAirportRepository);
        }
    }

    async __initCommentRepo() {
        if (!this.commentRepo) {
            this.commentRepo = await this.ctx.getBeanAsync(CommentRepository, idCommentRepository);
        }
    }

    /**
     * Get all cities
     * @param {number} limit 
     * @param {number} offset 
     * @returns City[]
     */
    async getAll(limit, offset) {
        await this.__initCityRepo();
        return await this.cityRepo.getAll({
            limit: limit,
            offset: offset,
        });
    }

    /**
     * Get city by ID
     * @param {number} id 
     * @returns City
     * @throws NotFoundException
     */
    async findById(id) {
        await this.__initCityRepo();
        const city = await this.cityRepo.findById(id);
        if (!city) {
            throw new NotFoundException('city not found');
        }
        await this.__initAirportRepo();
        const airports = await this.airportRepo.findByCityId(id);
        city.airports = airports;
        await this.__initCommentRepo();
        city.comments = await this.commentRepo.findByCity(id);
        return city;
    }

    /**
     * Delete by ID
     * @param {number} id 
     * @throws NotFoundException
     */
    async deleteById(id) {
        await this.__initCityRepo();
        const affected = await this.cityRepo.deleteById(id);
        if (!affected) {
            throw new NotFoundException('city not found');
        }
        await this.__initAirportRepo();
        await this.airportRepo.deleteForCity(id);
        await this.__initCommentRepo();
        await this.commentRepo.deleteForCity(id);
    }

    /**
     * Update city
     * @param {City} city
     * @throws NotFoundException
     */
    async update(city) {
        await this.__initCityRepo();
        const result = await this.cityRepo.update(city);
        if (!result) {
            throw new NotFoundException('city not found');
        }
    }

    /**
     * Save new city
     * @param {string} name
     */
    async create(name) {
        await this.__initCityRepo();
        await this.cityRepo.save(name);
    }
}

module.exports = {
    CityService: CityService,
    idCityService: idCityService,
};