/**
 * @module exceptions/unauthenticated_exception
 */

const BaseException = require('./base_exception.cjs').BaseException;

/**
 * Exception that represents lack of priviledges to perform action.
 * @augments BaseException
 */
class UnauthenticatedException extends BaseException {

    /**
     * @constructor
     * @param {string} message 
     */
    constructor(message) {
        super('UNAUTHENTICATED', message);
    }
}

module.exports.UnauthenticatedException = UnauthenticatedException;