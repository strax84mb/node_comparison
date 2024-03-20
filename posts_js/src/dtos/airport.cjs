/**
 * @module dtos/airport
 */

/**
 * DTO for airport resource
 */
class AirportDto {
    /**
     * @type number
     */
    id;

    /**
     * @type string
     */
    name;

    /**
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
 * Convert entity to DTO
 * @param {Airport} airport 
 * @returns {AirportDto} dto
 */
function airportToDto(airport) {
    return new AirportDto(airport.id, airport.name, airport.cityId);
}

module.exports = {
    airportToDto: airportToDto,
    AirportDto: AirportDto,
};