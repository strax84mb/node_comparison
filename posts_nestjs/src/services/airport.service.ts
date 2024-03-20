import { Inject, Injectable } from "@nestjs/common";
import { Airport } from "../entities/airport.entity";
import { Repository } from "typeorm";
import { PaginatedInput } from "../util/types";
import { NotFoundException } from "../exception/not-found.exception";

@Injectable()
export class AirportService {

    constructor(
        @Inject('AIRPORT_REPOSITORY') private airportRepo: Repository<Airport>,
    ) {}

    getAll(input: PaginatedInput): Promise<Airport[]> {
        return this.airportRepo.find({
            take: input.limit,
            skip: input.offset,
        });
    }

    async getById(id: number): Promise<Airport> {
        const airport = await this.airportRepo
            .createQueryBuilder()
            .where('id =:id', { id: id })
            .getOne();
        if (!airport) {
            throw new NotFoundException('airport not found');
        }
        return airport;
    }

    getByCityId(cityId: number): Promise<Airport[]> {
        return this.airportRepo.createQueryBuilder()
            .where('city_id = :cityId', {
                cityId: cityId,
            }).getMany();
    }

    async delete(id: number) {
        const result = await this.airportRepo.createQueryBuilder()
            .delete()
            .where('id =:id', { id: id })
            .execute();
        if (!result.affected) {
            throw new NotFoundException('airport not found');
        }
    }

    async update(airport: Airport) {
        const result = await this.airportRepo.update({
            id: airport.id,
        }, airport);
        if (!result.affected) {
            throw new NotFoundException('airport not found');
        }
    }

    async insert(airport: Airport) {
        this.airportRepo.insert(airport);
    }
}