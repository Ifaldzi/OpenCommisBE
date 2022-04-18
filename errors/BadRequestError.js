const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class BadRequestError extends CustomError {
    constructor(msg = null) {
        super(
            msg || "Bad Request, please check again your request",
            StatusCodes.BAD_REQUEST
        )
    }
}

module.exports = BadRequestError