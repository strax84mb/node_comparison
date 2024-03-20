/**
 * @module exceptions/not-found_exception
 * @exports NotFoundException
 */

const BaseException = require('./base_exception.cjs').BaseException;

/**
 * Exception describing that what was requested was not found.
 * @augments BaseException
 */
class NotFoundException extends BaseException {
    /**
     * @constructor
     * @param {string} message 
     */
    constructor(message) {
        super('NOT_FOUND', message);
    }
}

exports.NotFoundException = NotFoundException;