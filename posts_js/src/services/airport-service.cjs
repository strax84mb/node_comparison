const airportRepoModule = require('../repositories/airport-repo.cjs');
const { NotFoundException } = require('../exceptions/not-found_exception.cjs');

const idAirportService = 'app-services-AirportService';

/**
 * Service to work with airports
 */
class AirportService {
    ctx;

    /**
     * @constructor
     * @param {Context} ctx 
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    __init() {}
    async __initAsync() {}

    airportRepo;

    async __initAirportRepo() {
        if (!this.airportRepo) {
            this.airportRepo = await this.ctx.getBeanAsync(
                airportRepoModule.AirportRepository,
                airportRepoModule.idAirportRepository,
            );
        }
    }

    /**
     * Get all airports in regards to pagination
     * @param {PaginatedRepoInput} input 
     * @returns {Airport[]} Airport[]
     */
    async getAll(input) {
        await this.__initAirportRepo();
        return await this.airportRepo.find(input);
    }

    /**
     * Get airport with given ID
     * @param {number} id 
     * @returns {Airport} Requested airport
     * @throws NotFoundException
     */
    async getById(id) {
        await this.__initAirportRepo();
        const airport = await this.airportRepo.findById(id);
        if (!airport) {
            throw new NotFoundException('airport not found');
        }
        return airport;
    }

    /**
     * Get all airports in the city
     * @param {number} cityId 
     * @returns {Airport[]} All airports located in the city
     */
    async getAllInCity(cityId) {
        await this.__initAirportRepo();
        return await this.airportRepo.findByCityId(cityId);
    }

    /**
     * Updates existing airport
     * @param {Airport} airport 
     * @returns {Airport} Saved airport
     * @throws NotFoundException
     */
    async update(airport) {
        await this.__initAirportRepo();
        const savedAirport = await this.airportRepo.update(airport);
        if (!savedAirport) {
            throw new NotFoundException('airport not found');
        }
        return savedAirport;
    }

    /**
     * Deletes an airport from DB
     * @param {number} id 
     * @throws NotFoundException
     */
    async delete(id) {
        await this.__initAirportRepo();
        const affectedRows = await this.airportRepo.delete(id);
        if (!affectedRows) {
            throw new NotFoundException('airport not found');
        }
    }
    
    /**
     * Saves new airport
     * @param {Airport} airport 
     */
    async insert(airport) {
        await this.__initAirportRepo();
        await this.airportRepo.insert(airport);
    }
}

module.exports = {
    AirportService: AirportService,
    idAirportService: idAirportService,
};