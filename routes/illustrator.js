const { Router } = require('express')
const { ROLE } = require('../config/constants')
const commissionPostController = require('../controllers/CommissionPostController')
const AuthMiddleware = require('../middlewares/AuthMiddleware')

const router = Router()

router.get('/commissions', 
    AuthMiddleware.handle(ROLE.ILLUSTRATOR), 
    commissionPostController.getAllCommissionPostBelongToAuthenticatedUser
)

module.exports = { basePath: '/illustrator', router}