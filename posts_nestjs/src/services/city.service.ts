import { Inject, Injectable } from "@nestjs/common";
import { City } from "../entities/city.entity";
import { Repository } from "typeorm";
import { Airport } from "../entities/airport.entity";
import { Comment } from "../entities/comment.entity";
import { PaginatedInput } from "../util/types";
import { NotFoundException } from "../exception/not-found.exception";

@Injectable()
export class CityService {
    constructor(
        @Inject('CITY_REPOSITORY') private cityRepo: Repository<City>,
        @Inject('AIRPORT_REPOSITORY') private airportRepo: Repository<Airport>,
        @Inject('COMMENT_REPOSITORY') private commentRepo: Repository<Comment>,
    ) {}

    getAll(input: PaginatedInput): Promise<City[]> {
        return this.cityRepo.find({
            skip: input.offset,
            take: input.limit,
        });
    }

    async getById(id: number): Promise<City> {
        const city = await this.cityRepo.findOne({
            where: {
                id: id,
            },
        });
        if (!city) {
            throw new NotFoundException('city not found');
        }
        city.airports = await this.airportRepo.find({
            where: {
                cityId: id,
            }
        });
        city.comments = await this.commentRepo.find({
            where: {
                cityId: id,
            },
        })
        return city;
    }

    async saveNew(cityName: string) {
        const city = new City();
        city.name = cityName;
        await this.cityRepo.insert(city);
    }

    async delete(id: number) {
        await this.airportRepo.createQueryBuilder()
            .delete()
            .where('city_id = :cityId', { cityId: id })
            .execute();
        await this.commentRepo.createQueryBuilder()
            .delete()
            .where('city_id = :cityId', { cityId: id })
            .execute();
        const result = await this.cityRepo.createQueryBuilder()
            .delete()
            .where('id = :id', { id: id })
            .execute();
        if (!result.affected) {
            throw new NotFoundException('city not found');
        }
    }

    async updateName(city: City) {
        const result = await this.cityRepo.createQueryBuilder()
            .update()
            .set({
                name: city.name,
            })
            .where('id = :id', { id: city.id })
            .execute();
        if (!result.affected) {
            throw new NotFoundException('city not found');
        }
    }
}