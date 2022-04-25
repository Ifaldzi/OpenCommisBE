const { Router } = require("express");
const reviewController = require("../controllers/ReviewController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = Router()

router.delete(
    '/:id',
    AuthMiddleware.handle(),
    reviewController.deleteReview
)

module.exports = { basePath: '/reviews', router}