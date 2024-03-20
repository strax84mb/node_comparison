import { User } from "../entities/user";
import { Bean } from "../context/context";
import { MySqlDataSource, idMySqlDataSource } from "./data-source";
import { Repository } from "typeorm";

export const idUserRepository: string = 'app-repositories-UserRepository';

export class UserRepository extends Bean {
    private repo: Repository<User>;

    async __init() {
        const ds = await this.__ctx.getBean(idMySqlDataSource, MySqlDataSource) as MySqlDataSource;
        this.repo = ds.dataSource.getRepository(User);
    }

    findByEmailAndPassword(email: string, pass: string): Promise<User> {
        return this.repo.findOne({
            where: {
                email: email,
                password: pass,
            }
        })
    }

    findByEmail(email: string): Promise<User> {
        return this.repo.findOne({
            where: {
                email: email,
            }
        })
    }

    findById(id: number): Promise<User> {
        return this.repo.findOne({
            where: {
                id: id,
            }
        })
    }
}