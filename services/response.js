exports.sendSuccess = (res, message, data, code = 200) => {
    return res.status(code).json({
        success: true,
        message,
        data
    })
}

exports.sendError = (res, error, code = 400) => {
    return res.status(code).json({
        success: false,
        error
    })
}