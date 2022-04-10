const { randomUUID } = require('crypto')
const multer = require('multer')
const path = require('path')

const uploadPath = path.resolve(__dirname + '/../../temp/')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../temp')
    },
    filename: function (req, file, cb) {
        const filename = `${file.fieldname}-${randomUUID()}.${file.mimetype.split('/')[1]}`
        cb(null, filename)
    }
})

module.exports = multer({storage: storage})

// console.log(uploadPath);