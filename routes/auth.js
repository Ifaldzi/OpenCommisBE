const { Router } = require('express')
const router = Router()

const authController = require('../controllers/AuthController')
const authMiddleware = require('../middlewares/AuthMiddleware')

router.post('/login', authController.login)
router.post('/register/:role', authController.register)
router.post('/logout', authMiddleware.handle(), authController.logout)
router.post('/token/verify', authController.checkToken)
router.get('/verify', authController.verifyEmail)
router.post('/:role/:id/resend-verification', authController.resendVerificationEmail)

module.exports = { basePath: '/auth', router }