const { Controller } = require('./Controller')
const { BadRequestError } = require('../errors')

class UploadController extends Controller {
    constructor() {
        super()
    }

    upload = (req, res) => {
        const file = req.file

        if (!file)
            throw new BadRequestError('File not provided')

        return this.response.sendSuccess(res, 'File uploaded', { fileName: file.filename })
    }
}

module.exports = new UploadController()