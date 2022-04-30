const { Router } = require("express");
const upload = require('../middlewares/uploadMiddleware')
const authMiddleware = require('../middlewares/AuthMiddleware');
const uploadController = require("../controllers/UploadController");

const router = new Router()

router.post(
    '/image/upload',
    upload.single('image'),
    authMiddleware.handle(),
    uploadController.upload
)

module.exports = { basePath: '/', router }