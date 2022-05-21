const { Router } = require("express");
const { ROLE } = require("../config/constants");
const reviewController = require("../controllers/ReviewController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = Router()

router.delete(
    '/:id',
    AuthMiddleware.handle(ROLE.ADMIN),
    reviewController.deleteReview
)

module.exports = { basePath: '/reviews', router}