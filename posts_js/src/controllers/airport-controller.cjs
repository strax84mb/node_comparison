const { AirportService, idAirportService } = require('../services/airport-service.cjs');
const { AuthService, idAuthService } = require('../services/auth-service.cjs');
const { getNumber } = require('./utils.cjs');
const { airportToDto } = require('../dtos/airport.cjs');


const idAirportController = 'app-controllers-AirportController';

/**
 * Controller for airport domain
 */
class AirportController {
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

    airportService;

    async __initAirportService() {
        if (!this.airportService) {
            this.airportService = await this.ctx.getBeanAsync(AirportService, idAirportService);
        }
    }

    authService;

    async __initAuthService() {
        if (!this.authService) {
            this.authService = await this.ctx.getBeanAsync(AuthService, idAuthService);
        }
    }

    /**
     * Get all airports (in regards to pagination)
     * @param {APIGatewayProxyEvent} event 
     * @returns {AirportDto[]} AirportDto[]
     */
    async getAll(event) {
        await this.__initAirportService();
        const limit = getNumber(
            event && event.queryStringParameters && event.queryStringParameters.limit,
            'limit must be a non-negative number',
            false,
            10);
        const offset = getNumber(
            event && event.queryStringParameters && event.queryStringParameters.offset,
            'offset must be a non-negative number',
            false,
            0);
        const airports = await this.airportService.getAll({
            limit: limit,
            offset: offset,
        });
        return {
            statusCode: 200,
            body: JSON.stringify(airports.map(a => airportToDto(a))),
        };
    }

    /**
     * Get one airport
     * @param {APIGatewayProxyEvent} event 
     * @returns {AirportDto} AirportDto
     */
    async getOne(event) {
        await this.__initAirportService();
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = getNumber(idParam, 'id must be a non-negative number', true);
        const airport = this.airportService.getById(id);
        return {
            statusCode: 200,
            body: JSON.stringify(airportToDto(airport)),
        };
    }

    /**
     * Get all airports in the city
     * @param {APIGatewayProxyEvent} event 
     * @returns {AirportDto[]} AirportDto[]
     */
    async getAllInCity(event) {
        await this.__initAirportService();
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = getNumber(idParam, 'id must be a non-negative number', true);
        const airports = await this.airportService.getAllInCity(id);
        return {
            statusCode: 200,
            body: JSON.stringify(
                airports ? 
                airports.map(a => airportToDto(a))
                : []
            ),
        };
    }

    /**
     * Save new airport
     * @param {APIGatewayProxyEvent} event 
     */
    async saveNewAirport(event) {
        await this.__initAuthService();
        await this.authService.userHasRoles(event, ['admin']);
        await this.__initAirportService();
        const airport = JSON.parse(event.body);
        await this.airportService.insert(airport);
        return { statusCode: 201 };
    }

    /**
     * Delete airport
     * @param {APIGatewayProxyEvent} event 
     */
    async deleteOne(event) {
        await this.__initAuthService();
        await this.authService.userHasRoles(event, ['admin']);
        await this.__initAirportService();
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = getNumber(idParam, 'id must be a non-negative number', true);
        await this.airportService.delete(id);
        return { statusCode: 200 };
    }

    /**
     * Update airport data
     * @param {APIGatewayProxyEvent} event 
     * @returns {AirportDto} Saved airport data
     */
    async updateAirport(event) {
        await this.__initAuthService();
        await this.authService.userHasRoles(event, ['admin']);
        await this.__initAirportService();
        const airport = JSON.parse(event.body);
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        airport.id = getNumber(idParam, 'id must be a non-negative number', true);
        const savedAirport = await this.airportService.update(airport);
        return {
            statusCode: 200,
            body: JSON.stringify(airportToDto(savedAirport)),
        };
    }
}

module.exports = {
    AirportController: AirportController,
    idAirportController: idAirportController,
};