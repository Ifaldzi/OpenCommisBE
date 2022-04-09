const { enviroment } = require("../config/config");
const CustomError = require("../errors/CustomError")
const { sendError } = require('../services/response')

const errorHandler = (err, req, res, next) => {
    if (enviroment == 'development')
        console.log(err);

    if (err instanceof CustomError) {
        return sendError(res, err.message, err.statusCode)
    }

    return sendError(res, 'Something went wrong, please try agai later', 500)
}

module.exports = errorHandler