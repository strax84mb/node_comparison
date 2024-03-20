/**
 * @module exceptions/bad-request-exceptions
 */

const BaseException = require('./base_exception.cjs').BaseException;

/**
 * Exception representing a bad request
 * @augments BaseException
 */
class BadRequestException extends BaseException {

    /**
     * @constructor
     * @param {string} message 
     */
    constructor(message) {
        super('BAD_REQUEST', message);
    }
}

module.exports.BadRequestException = BadRequestException;