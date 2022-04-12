const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class ForbiddenError extends CustomError {
    constructor(msg = null) {
        console.log(msg);
        super(
            msg || 'You dont have access to this resource',
            StatusCodes.FORBIDDEN
        )
    }
}

module.exports = ForbiddenError