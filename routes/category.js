const { Router } = require('express')
const categoryController = require('../controllers/CategoryController')
const router = Router()

router.get('/', categoryController.getAllCategories)

module.exports = { basePath: '/categories', router}