const { Router } = require('express')
const { ROLE } = require('../config/constants')
const commissionPostController = require('../controllers/CommissionPostController')
const authMiddleware = require('../middlewares/AuthMiddleware')
const upload = require('../middlewares/uploadMiddleware')
const router = Router()


router.get('/', commissionPostController.getAllCommissionPosts)
router.get('/search', commissionPostController.searchCommission)
router.get('/:id', commissionPostController.getCommissionPost)
router.post('/', 
    authMiddleware.handle('illustrator'), 
    upload.array('images', 4), 
    commissionPostController.createCommissionPosts
)
router.put('/:id', 
    authMiddleware.handle(ROLE.ILLUSTRATOR), 
    upload.fields([
        {name: 'image_1', maxCount: 1}, 
        {name: 'image_2', maxCount: 1}, 
        {name: 'image_3', maxCount: 1}, 
        {name: 'image_4', maxCount: 1}
    ]),
    commissionPostController.updateCommissionPost
)
router.delete('/:id',
    authMiddleware.handle([ROLE.ILLUSTRATOR, ROLE.ADMIN]),
    commissionPostController.deleteCommissionPost
)

module.exports = {basePath: '/commissions', router}