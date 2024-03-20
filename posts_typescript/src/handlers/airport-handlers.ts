import { AirportService, idAirportService } from "../services/airport-service";
import { Bean } from "../context/context";
import { AuthService, idAuthService } from "../services/auth-service";
import { Event, Response, SaveAirportDto, airportToDto, getNumber, respond } from "./types";
import { BadRequestException } from "../exceptions/bad-request-exception";
import { IAirportHandlers } from "./i-airport-handlers";

export class AirportHandlers extends Bean implements IAirportHandlers {
    async __init() {}

    private airportService: AirportService;
    private authService: AuthService;

    private async __initAirportService() {
        if (!this.airportService) {
            this.airportService = await this.__ctx.getBean(idAirportService, AirportService) as AirportService;
        }
    }

    private async __initAuthService() {
        if (!this.authService) {
            this.authService = await this.__ctx.getBean(idAuthService, AuthService) as AuthService;
        }
    }

    async getAll(event: Event): Promise<Response> {
        const limit = getNumber(
            event.queryStringParameters?.['limit'],
            'limit must be a non-negative number',
            true,
        );
        const offset = getNumber(
            event.queryStringParameters?.['offset'],
            'offset must be a non-negative number',
            true,
        );
        await this.__initAirportService();
        const airports = await this.airportService.getAll({
            limit: limit,
            offset: offset,
        });
        return respond(200, airports.map(a => airportToDto(a)));
    }

    async getOne(event: Event): Promise<Response> {
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        await this.__initAirportService();
        const airport = await this.airportService.getById(id);
        return respond(200, airportToDto(airport));
    }

    async getForCity(event: Event): Promise<Response> {
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        await this.__initAirportService();
        const airports = await this.airportService.getByCity(id);
        return respond(200, airports.map(a => airportToDto(a)));
    }

    private validatePayload(body: string): SaveAirportDto {
        const obj = JSON.parse(body);
        if (!obj || typeof obj?.cityId != 'number' || typeof obj?.name != 'string') {
            throw new BadRequestException('incorrect payload');
        }
        return {
            cityId: obj.cityId,
            name: obj.name,
        };
    }

    async saveNew(event: Event): Promise<Response> {
        await this.__initAuthService();
        await this.authService.hasRights(event, ['admin']);
        const body = this.validatePayload(event.body);
        await this.__initAirportService();
        await this.airportService.saveNew({
            id: null,
            cityId: body.cityId,
            name: body.name,
        });
        return respond(200);
    }

    async update(event: Event): Promise<Response> {
        await this.__initAuthService();
        await this.authService.hasRights(event, ['admin']);
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        const body = this.validatePayload(event.body);
        await this.__initAirportService();
        await this.airportService.update({
            id: id,
            cityId: body.cityId,
            name: body.name,
        });
        return respond(200);
    }

    async delete(event: Event): Promise<Response> {
        await this.__initAuthService();
        await this.authService.hasRights(event, ['admin']);
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        await this.__initAirportService();
        await this.airportService.delete(id);
        return respond(200);
    }
}