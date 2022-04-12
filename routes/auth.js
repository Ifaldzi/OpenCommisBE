const { Router } = require('express')
const router = Router()

const authController = require('../controllers/AuthController')

router.post('/login', authController.login)
router.post('/register/:role', authController.register)

module.exports = { basePath: '/auth', router }