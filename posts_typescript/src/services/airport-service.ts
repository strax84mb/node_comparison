import { PaginationInput } from "../util/types";
import { Bean } from "../context/context";
import { Airport } from "../entities/airport";
import { AirportRepository, idAirportRepository } from "../repositories/airport-repo";
import { NotFoundException } from "../exceptions/not-found-exception";

export const idAirportService = 'app-services-AirportService';

export class AirportService extends Bean {
    async __init() {}

    private airportRepo: AirportRepository;

    async __initAirportRepo() {
        if (!this.airportRepo) {
            this.airportRepo = await this.__ctx.getBean(idAirportRepository, AirportRepository) as AirportRepository;
        }
    }

    async getAll(input: PaginationInput): Promise<Airport[]> {
        await this.__initAirportRepo();
        return await this.airportRepo.findAll(input);
    }

    async getById(id: number): Promise<Airport> {
        await this.__initAirportRepo();
        const airport = await this.airportRepo.findById(id);
        if (!airport) {
            throw new NotFoundException('airport not found');
        }
        return airport;
    }

    async getByCity(cityId: number): Promise<Airport[]> {
        await this.__initAirportRepo();
        return await this.airportRepo.findByCityId(cityId);
    }

    async delete(id: number) {
        await this.__initAirportRepo();
        const numberOfDeletedRows = await this.airportRepo.delete(id);
        if (!numberOfDeletedRows) {
            throw new NotFoundException('airport not found');
        }
    }

    async update(airport: Airport) {
        await this.__initAirportRepo();
        const numberOfUpdatedRows = await this.airportRepo.update(airport);
        if (!numberOfUpdatedRows) {
            throw new NotFoundException('airport not found');
        }
    }

    async saveNew(airport: Airport) {
        await this.__initAirportRepo();
        await this.airportRepo.insert(airport);
    }
}