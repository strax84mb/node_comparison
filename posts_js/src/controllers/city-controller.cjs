/**
 * @module controllers/city-controller
 */

const { City } = require('../entities/city.cjs');
const cityServiceModule = require('../services/city-service.cjs');
const { AuthService, idAuthService } = require('../services/auth-service.cjs');
const requestUtils = require('./utils.cjs');
const cityToDto = require('../dtos/city.cjs').cityToDto;
const BadRequestException = require('../exceptions/bad-request_exception.cjs').BadRequestException;

const idCityController = 'app-controllers-CityController';

/**
 * Controller for City resources
 */
class CityController {
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
     * City service
     * @type CityService
     */
    cityService;

    /**
     * Initiate city service if not yet initiated.
     */
    async __initCityService() {
        if (!this.cityService) {
            this.cityService = await this.ctx.getBeanAsync(
                cityServiceModule.CityService,
                cityServiceModule.idCityService,
            );
        }
    }

    authService;

    async __initAuthService() {
        if (!this.authService) {
            this.authService = await this.ctx.getBeanAsync(AuthService, idAuthService);
        }
    }

    /**
     * Get all cities. Limit and offset are extracted from event.
     * @param {APIGatewayProxyEvent} event 
     * @returns {Array.<CityDto>} CityDto[]
     */
    async getAll(event) {
        await this.__initCityService();
        const limit = requestUtils.getNumber(
            event && event.queryStringParameters && event.queryStringParameters.limit,
            'limit must be a non-negative number',
            false,
            10);
        const offset = requestUtils.getNumber(
            event && event.queryStringParameters && event.queryStringParameters.offset,
            'offset must be a non-negative number',
            false,
            0);
        const cities = await this.cityService.getAll(limit, offset);
        return {
            statusCode: 200,
            body: JSON.stringify(cities.map(c => cityToDto(c))),
        };
    }

    /**
     * Get city by its ID.
     * @param {APIGatewayProxyEvent} event 
     * @returns {CityDto} CityDto
     */
    async getOne(event) {
        await this.__initCityService();
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = requestUtils.getNumber(idParam, 'id must be a non-negative number', true);
        const city = await this.cityService.findById(id);
        return {
            statusCode: 200,
            body: JSON.stringify(cityToDto(city)),
        };
    }

    /**
     * Delete city with given ID
     * @param {APIGatewayProxyEvent} event 
     */
    async delete(event) {
        await this.__initAuthService();
        await this.authService.userHasRoles(event, ['admin']);
        await this.__initCityService();
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = requestUtils.getNumber(idParam, 'id must be a non-negative number', true);
        await this.cityService.deleteById(id);
        return { statusCode: 200 };
    }

    /**
     * Save new city
     * @param {APIGatewayProxyEvent} event 
     */
    async create(event) {
        await this.__initAuthService();
        await this.authService.userHasRoles(event, ['admin']);
        await this.__initCityService();
        const body = JSON.parse(event.body);
        if (!body || !body.name) {
            throw new BadRequestException('Incorrect payload. Missing filed "name"');
        }
        await this.cityService.create(body.name);
        return { statusCode: 201 };
    }

    /**
     * Update city name
     * @param {APIGatewayProxyEvent} event 
     */
    async update(event) {
        await this.__initAuthService();
        await this.authService.userHasRoles(event, ['admin']);
        await this.__initCityService();
        const idParam = event.requestContext.path.substr('/dev/'.length).split('/')[1];
        const id = requestUtils.getNumber(idParam, 'id must be a non-negative number', true);
        const body = JSON.parse(event.body);
        if (!body || !body.name) {
            throw new BadRequestException('Incorrect payload. Missing filed "name"');
        }
        await this.cityService.update(new City(id, body.name));
        return { statusCode: 200 };
    }
}

module.exports = {
    idCityController: idCityController,
    CityController: CityController,
};