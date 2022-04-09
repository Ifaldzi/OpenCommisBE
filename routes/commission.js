const { Router } = require('express')
const commissionPostController = require('../controllers/CommissionPostController')
const authMiddleware = require('../middlewares/AuthMiddleware')
const router = Router()


// router.post('/login', authController.login)
// router.post('/register/:role', authController.register)

router.get('/', commissionPostController.getAllCommissionPosts)
router.get('/search', commissionPostController.searchCommission)
router.get('/:id', commissionPostController.getCommissionPost)
router.post('/', authMiddleware.handle('illustrator'), commissionPostController.createCommissionPosts)

module.exports = router