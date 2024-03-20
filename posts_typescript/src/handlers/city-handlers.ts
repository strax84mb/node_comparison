import { CityService, idCityService } from "../services/city-service";
import { Bean } from "../context/context";
import { Event, Response, cityToDto, getNumber, respond } from './types';
import { AuthService, idAuthService } from "../services/auth-service";
import { SaveNewCityDto } from './types';
import { BadRequestException } from "../exceptions/bad-request-exception";
import { City } from "../entities/city";
import { ICityHandlers } from "./i-city-handlers";

export class CityHandlers extends Bean implements ICityHandlers {
    async __init() {}

    private cityService: CityService;
    private authService: AuthService;

    private async __initCityService() {
        if (!this.cityService) {
            this.cityService = await this.__ctx.getBean(idCityService, CityService) as CityService;
        }
    }

    private async __initAuthService() {
        if (!this.authService) {
            this.authService = await this.__ctx.getBean(idAuthService, AuthService) as AuthService;
        }
    }

    async getAll(event: Event): Promise<Response> {
        await this.__initCityService();
        const limit = getNumber(
            event.queryStringParameters?.['limit'],
            'limit must be a non-negative number',
            true,
            10
        );
        const offset = getNumber(
            event.queryStringParameters?.['offset'],
            'offset must be a non-negative number',
            true,
            0,
        );
        const cities = await this.cityService.getAll({
            limit: limit,
            offset: offset,
        });
        return respond(200, cities.map(c => cityToDto(c)));
    }

    async getOne(event: Event): Promise<Response> {
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        await this.__initCityService();
        const city = await this.cityService.getById(id);
        return respond(200, cityToDto(city));
    }

    async saveNew(event: Event): Promise<Response> {
        await this.__initAuthService();
        await this.authService.hasRights(event, ['admin']);
        const body = JSON.parse(event.body);
        if (!(body instanceof SaveNewCityDto)) {
            throw new BadRequestException('malformed payload');
        }
        await this.__initCityService();
        await this.cityService.saveNew({ name: body.name } as City);
        return respond(201);
    }

    async update(event: Event): Promise<Response> {
        await this.__initAuthService();
        await this.authService.hasRights(event, ['admin']);
        const id = getNumber(
            event.requestContext.path.substring('/dev/'.length).split('/')[1],
            'id must be a non-negative number',
            true,
        );
        const body = JSON.parse(event.body);
        if (!(body instanceof SaveNewCityDto)) {
            throw new BadRequestException('malformed payload');
        }
        await this.__initCityService();
        await this.cityService.update({
            id: id,
            name: body?.name,
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
        await this.__initCityService();
        await this.cityService.delete(id);
        return respond(200);
    }
}