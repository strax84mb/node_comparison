import { Repository } from "typeorm";
import { Bean } from "../context/context";
import { MySqlDataSource, idMySqlDataSource } from "./data-source";
import { Airport } from "../entities/airport";
import { PaginationInput } from "../util/types";

export const idAirportRepository: string = 'app-repositories-AirportRepository';

export class AirportRepository extends Bean {

    private repo: Repository<Airport>;

    async __init() {
        const ds = await this.__ctx.getBean(idMySqlDataSource, MySqlDataSource) as MySqlDataSource;
        this.repo = ds.dataSource.getRepository(Airport);
    }

    findAll(input: PaginationInput): Promise<Airport[]> {
        return this.repo.find({
            take: input.limit,
            skip: input.offset,
        });
    }

    findById(id: number): Promise<Airport> {
        return this.repo.findOne({
            where: {
                id: id,
            },
        });
    }

    findByCityId(cityId: number): Promise<Airport[]> {
        return this.repo.find({
            where: {
                cityId: cityId,
            },
        });
    }

    async insert(airport: Airport) {
        await this.repo.insert(airport);
    }

    async update(airport: Airport): Promise<number> {
        const result = await this.repo.createQueryBuilder()
            .update()
            .set({
                cityId: airport.cityId,
                name: airport.name,
            })
            .where('id = :id', { id: airport.id })
            .execute();
        return result.affected;
    }

    async delete(id: number): Promise<number> {
        const result = await this.repo.createQueryBuilder()
            .delete()
            .where('id = :id', { id: id })
            .execute();
        return result.affected;
    }

    async deleteByCityId(cityId: number) {
        await this.repo.createQueryBuilder()
            .delete()
            .where('city_id = :id', { id: cityId })
            .execute();
    }
}