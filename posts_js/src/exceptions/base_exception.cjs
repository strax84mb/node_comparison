/**
 * @module exceptions/base_exception
 * @exports BaseException
 */

/**
 * This is a base exception and all other exceptions returned should be based on this.
 */
class BaseException {
    /**
     * String value of an error code.
     * @description Allowed values are:<ul><li>UNEXPECTED_ERROR</li><li>NOT_FOUND</li><li>UNAUTHENTICATED</li><li>FORBIDEN</li><li>BAD_REQUEST</li></ul>
     * @type string
     */
    errorCode;

    /**
     * Textual description of error.
     * @type string
     */
    message;

    /**
     * @constructor
     * @param {string} errorCode 
     * @param {string} message 
     */
    constructor(errorCode, message) {
        this.errorCode = errorCode;
        this.message = message;
    };

    toHttpStatusCode() {
        switch (this.errorCode) {
            case 'UNEXPECTED_ERROR':
                return 500;
            case 'NOT_FOUND':
                return 404;
            case 'UNAUTHENTICATED':
                return 401;
            case 'FORBIDEN':
                return 403;
            case 'BAD_REQUEST':
                return 400;
        }
        return 500;
    }
}

exports.BaseException = BaseException;