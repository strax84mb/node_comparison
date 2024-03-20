/**
 * @module exceptions/forbiden
 */

const BaseException = require('./base_exception.cjs').BaseException;

/**
 * Exception representing that resource is forbiden
 * @augments BaseException
 */
class ForbidenException extends BaseException {
    /**
     * @constructor
     * @param {string} message 
     */
    constructor(message) {
        super('FORBIDEN', message);
    }
}

module.exports.ForbidenException = ForbidenException;