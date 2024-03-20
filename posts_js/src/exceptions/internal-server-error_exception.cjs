/** 
 * @module  exceptions/internal-server-error_exception
 * @exports InternalServerErrorException
*/

const BaseException = require('./base_exception.cjs').BaseException;

/**
 * Construct an exceptioon that will indicate unforseen error.
 * @augments BaseException
 */
class InternalServerErrorException extends BaseException {
    /**
     * @constructor
     * @param {string} message 
     */
    constructor(message) {
        super('UNEXPECTED_ERROR', message);
    }
}

exports.InternalServerErrorException = InternalServerErrorException;