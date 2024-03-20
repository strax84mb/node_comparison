const EntitySchema = require('typeorm').EntitySchema;

/**
 * @module entities/city
 */

/**
 * City entity
 */
class City {
    /**
     * ID of city
     * @type number
     */
    id;

    /**
     * Name of city
     * @type string
     */
    name;

    /** @constructor */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Airports located in the city
     * @type Airport[]
     */
    airports;
}

/**
 * City schema
 */
const cityEntitySchema = new EntitySchema({
    name: 'cities',
    tableName: 'cities',
    target: City,
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
    },
});

module.exports = {
    City: City,
    cityEntitySchema: cityEntitySchema
};