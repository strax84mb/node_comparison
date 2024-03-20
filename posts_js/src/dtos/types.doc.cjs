/**
 * @typedef CityAirportDto
 * @property {number} id
 * @property {string} name
 * 
 * @typedef CityCommentDto
 * @property {number} id
 * @property {number} userId
 * @property {string} text
 * @property {Date} updatedAt
 * @property {Date} createdAt
 * 
 * @typedef CityDto
 * @property {number} id
 * @property {string} name
 * @property {CityAirportDto[]} airports
 * @property {CityCommentDto[]} comments
 */