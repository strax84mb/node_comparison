import { Airport } from '../entities/airport';
import { Bean } from '../context/context';
import { City } from '../entities/city';
import { Comment } from '../entities/comment';
import { DataSource } from 'typeorm';
import { User } from '../entities/user';

export const idMySqlDataSource: string = 'id-repositories-MySqlDataSource';

export class MySqlDataSource extends Bean {

    dataSource: DataSource;

    async __init() {
        this.dataSource = new DataSource({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "rust_travel_adv_user",
            password: "rust_travel_adv_pass",
            database: "rust_travel_advisor",
            entities: [
                Airport,
                City,
                User,
                Comment,
            ],
        });
        await this.dataSource.initialize();
    }
}