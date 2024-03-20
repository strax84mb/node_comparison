import { DataSource } from "typeorm";
import { Airport } from "./entities/airport.entity";
import { User } from "./entities/user.entity";
import { City } from "./entities/city.entity";
import { Comment } from "./entities/comment.entity";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'rust_travel_adv_user',
                password: 'rust_travel_adv_pass',
                database: 'rust_travel_advisor',
                entities: [
                    Airport,
                    Comment,
                    User,
                    City,
                ],
                synchronize: false,
            });
            return dataSource.initialize();
        },
    },
];

export const repoProviders = [
    {
        provide: 'AIRPORT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Airport),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'COMMENT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Comment),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'CITY_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(City),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'USER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: ['DATA_SOURCE'],
    },
];