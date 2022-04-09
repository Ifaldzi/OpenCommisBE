const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class NotFoundError extends CustomError {
    constructor(msg = null) {
        super(
            msg || 'Data not found',
            StatusCodes.NOT_FOUND
        )
    }
}

module.exports = NotFoundError