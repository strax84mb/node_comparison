/**
 * @module dtos/city
 */

/**
 * Converts a city to DTO
 * @param {City} city 
 * @returns {CityDto} CityDto
 */
function cityToDto(city) {
    return {
        id: city.id,
        name: city.name,
        airports: city.airports ? 
            city.airports.map(a => {
                return {
                    id: a.id,
                    name: a.name,
                };
            }) : [],
        comments: city.comments ?
            city.comments.map(c => {
                return {
                    id: c.id,
                    userId: c.userId,
                    text: c.text,
                    createdAt: c.createdAt,
                    updatedAt: c.updatedAt,
                };
            }) : [],
    };
}

module.exports = {
    cityToDto: cityToDto,
};