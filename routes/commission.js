const { Router } = require('express')
const commissionPostController = require('../controllers/CommissionPostController')
const router = Router()


// router.post('/login', authController.login)
// router.post('/register/:role', authController.register)

router.get('/', commissionPostController.getAllCommissionPosts)

module.exports = router