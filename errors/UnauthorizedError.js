const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class UnauthorizedError extends CustomError {
    constructor(msg = null) {
        super(
            msg || 'Unauthorized',
            StatusCodes.UNAUTHORIZED
        )
    }
}

module.exports = UnauthorizedError