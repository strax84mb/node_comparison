const BadRequestException = require('../exceptions/bad-request_exception.cjs').BadRequestException;

function getNumber(stringValue, errorMessage, mandatory, defaultValue) {
    const value = +stringValue;
    if (value + '' == 'NaN') {
        if (mandatory) {
            throw new BadRequestException(errorMessage);
        } else {
            return defaultValue;
        }
    }
    if (value < 0) {
        throw new BadRequestException(errorMessage);
    }
    return value;
}

module.exports = {
    getNumber: getNumber,
};