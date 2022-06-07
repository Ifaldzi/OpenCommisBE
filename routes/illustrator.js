const { Router } = require('express')
const { ROLE } = require('../config/constants')
const commissionPostController = require('../controllers/CommissionPostController')
const illustratorController = require('../controllers/IllustratorController')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const upload = require('../middlewares/uploadMiddleware')

const router = Router()

router.get('/commissions', 
    AuthMiddleware.handle(ROLE.ILLUSTRATOR), 
    commissionPostController.getAllCommissionPostBelongToAuthenticatedUser
)

router.get('/:illustratorId/portfolio', illustratorController.getIllustratorPortfolio)

router.get(
    '/portfolio',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    illustratorController.getIllustratorPortfolio
)

router.post(
    '/artworks',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    upload.single('image'),
    illustratorController.addArtwork
)

router.delete(
    '/artworks/:artworkId',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    illustratorController.deleteArtwork
)

router.post(
    '/portfolio',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    upload.single('profile_picture'),
    illustratorController.updatePortfolio
)

router.get(
    '/balance',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    illustratorController.getBalance
)

router.post(
    '/verify-account',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    illustratorController.verifyAccount
)

router.get(
    '/:illustratorId/verification-submission',
    AuthMiddleware.handle([ROLE.ADMIN, ROLE.ILLUSTRATOR]),
    illustratorController.getVerificationSubmissionDetail
)

module.exports = { basePath: '/illustrator', router}