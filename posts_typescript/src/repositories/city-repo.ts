import { City } from '../entities/city';
import { Bean } from '../context/context';
import { idMySqlDataSource, MySqlDataSource } from './data-source';
import { Repository } from 'typeorm';
import { PaginationInput } from 'src/util/types';

export const idCityRepository: string = 'app-repositories-CityRepository';

export class CityRepository extends Bean {

    async __init() {
        const ds = await this.__ctx.getBean(idMySqlDataSource, MySqlDataSource) as MySqlDataSource;
        this.repo = ds.dataSource.getRepository(City);
    }

    private repo: Repository<City>;

    getAll(input: PaginationInput): Promise<City[]> {
        return this.repo.find({
            skip: input.offset,
            take: input.limit,
        });
    }

    findById(id: number): Promise<City> {
        return this.repo.findOne({
            where: {
                id: id,
            }
        })
    }

    async delete(id: number): Promise<number> {
        const result = await this.repo.createQueryBuilder()
            .delete()
            .where('id = :id', { id: id })
            .execute();
        return result.affected;
    }

    async update(city: City): Promise<number> {
        const result = await this.repo.createQueryBuilder()
            .update()
            .set({
                name: city.name,
            })
            .where('id = :id', { id: city.id })
            .execute();
        return result.affected;
    }

    async insert(city: City) {
        await this.repo.insert(city);
    }
}