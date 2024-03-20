const EntitySchema = require('typeorm').EntitySchema;

/**
 * @module entities/airport
 */

/**
 * Airport entity
 */
class Airport {
    /**
     * ID of airport
     * @type number
     */
    id;

    /**
     * Name of airport
     * @type string
     */
    name;

    /**
     * ID of city where airport is located.
     * @type number
     */
    cityId;

    /**
     * @constructor
     * @param {number} id 
     * @param {string} name 
     * @param {number} cityId 
     */
    constructor(id, name, cityId) {
        this.id = id;
        this.name = name;
        this.cityId = cityId;
    }
}

/**
 * Airport schema
 */
const airportEntitySchema = new EntitySchema({
    name: 'airports',
    tableName: 'airports',
    target: Airport,
    columns: {
        id: {
            name: 'id',
            primary: true,
            type: 'bigint',
            generated: true,
        },
        name: {
            name: 'name',
            type: 'varchar',
        },
        cityId: {
            name: 'city_id',
            type: 'bigint',
        },
    },
});

module.exports = {
    Airport: Airport,
    airportEntitySchema: airportEntitySchema,
};
