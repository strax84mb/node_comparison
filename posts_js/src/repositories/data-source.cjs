const DataSource = require('typeorm').DataSource;

const idMySqlDataSource = 'app-repositories-MySqlDataSource'

class MySqlDataSource {
    ctx;

    constructor(ctx) {
        this.ctx = ctx;
    }

    dataSource = new DataSource({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "rust_travel_adv_user",
        password: "rust_travel_adv_pass",
        database: "rust_travel_advisor",
        entities: [
            require('../entities/airport.cjs').airportEntitySchema,
            require('../entities/city.cjs').cityEntitySchema,
            require('../entities/user.cjs').userEntitySchema,
        ],
    });

    async __initAsync() {
        await this.dataSource.initialize();
    }
}

module.exports.MySqlDataSource = MySqlDataSource;
module.exports.idMySqlDataSource = idMySqlDataSource;