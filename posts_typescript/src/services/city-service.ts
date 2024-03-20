import { PaginationInput } from '../util/types';
import { Bean } from '../context/context';
import { CityRepository, idCityRepository } from '../repositories/city-repo';
import { City } from '../entities/city';
import { AirportRepository, idAirportRepository } from '../repositories/airport-repo';
import { CommentRepository, idCommentRepository } from '../repositories/comment-repo';
import { NotFoundException } from '../exceptions/not-found-exception';

export const idCityService: string = 'app-services-CityService';

export class CityService extends Bean {
    async __init() {}

    private cityRepo: CityRepository;
    private airportRepo: AirportRepository;
    private commentRepo: CommentRepository;

    private async __initCityRepo() {
        if (!this.cityRepo) {
            this.cityRepo = await this.__ctx.getBean(idCityRepository, CityRepository) as CityRepository;
        }
    }

    private async __initAirportRepo() {
        if (!this.airportRepo) {
            this.airportRepo = await this.__ctx.getBean(idAirportRepository, AirportRepository) as AirportRepository;
        }
    }

    private async __initCommentRepo() {
        if (!this.commentRepo) {
            this.commentRepo = await this.__ctx.getBean(idCommentRepository, CommentRepository) as CommentRepository;
        }
    }

    async getAll(input: PaginationInput): Promise<City[]> {
        await this.__initCityRepo();
        return await this.cityRepo.getAll(input);
    }

    async getById(id: number): Promise<City> {
        await this.__initCityRepo();
        const city = await this.cityRepo.findById(id);
        if (!city) {
            throw new NotFoundException('city not found');
        }
        await this.__initAirportRepo();
        city.airports = await this.airportRepo.findByCityId(id);
        await this.__initCommentRepo();
        city.comments = await this.commentRepo.findByCityId(id);
        return city;
    }

    async update(city: City) {
        await this.__initCityRepo();
        const numberOfUpdatedRows = await this.cityRepo.update(city);
        if (!numberOfUpdatedRows) {
            throw new NotFoundException('city not found');
        }
    }

    async delete(id: number) {
        await this.__initAirportRepo();
        await this.airportRepo.deleteByCityId(id);
        await this.__initCommentRepo();
        await this.commentRepo.deleteByCityId(id);
        await this.__initCityRepo();
        const numberOfDeletedRows = await this.cityRepo.delete(id);
        if (!numberOfDeletedRows) {
            throw new NotFoundException('city not found');
        }
    }

    async saveNew(city: City) {
        await this.__initCityRepo();
        await this.cityRepo.insert(city);
    }
}