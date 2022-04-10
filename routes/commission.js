const { Router } = require('express')
const { ROLE } = require('../config/constants')
const commissionPostController = require('../controllers/CommissionPostController')
const authMiddleware = require('../middlewares/AuthMiddleware')
const upload = require('../middlewares/uploadMiddleware')
const router = Router()


// router.post('/login', authController.login)
// router.post('/register/:role', authController.register)

router.get('/', commissionPostController.getAllCommissionPosts)
router.get('/search', commissionPostController.searchCommission)
router.get('/:id', commissionPostController.getCommissionPost)
router.post('/', authMiddleware.handle('illustrator'), upload.array('images', 4), commissionPostController.createCommissionPosts)
router.put('/:id', authMiddleware.handle(ROLE.ILLUSTRATOR), commissionPostController.updateCommissionPost)

module.exports = router