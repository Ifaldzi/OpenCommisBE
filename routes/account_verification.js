const { Router } = require("express");
const { ROLE } = require("../config/constants");
const illustratorController = require("../controllers/IllustratorController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = Router()

router.post(
    '/approve',
    AuthMiddleware.handle(ROLE.ADMIN),
    illustratorController.approveVerificationSubmission
)

router.get(
    '/',
    AuthMiddleware.handle(ROLE.ADMIN),
    illustratorController.getIllustratorsWhoSubmittedAccountVerification
)

module.exports = { basePath: '/verifications', router }