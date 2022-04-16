const { StatusCodes } = require("http-status-codes");
const { ValidationError } = require("sequelize");
const { enviroment } = require("../config/config");
const CustomError = require("../errors/CustomError")
const { sendError } = require('../services/response')

const errorHandler = (err, req, res, next) => {
    if (enviroment == 'development')
        console.log(err);

    if (err instanceof CustomError) {
        return sendError(res, err.message, err.statusCode)
    }

    if (err instanceof ValidationError) {
        return sendError(res, 'Bad request, check again your input request', StatusCodes.BAD_REQUEST)
    }

    return sendError(res, 'Something went wrong, please try again later', StatusCodes.INTERNAL_SERVER_ERROR)
}

module.exports = errorHandler