const { Router } = require("express");
const userController = require("../controllers/UserController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = Router()

router.get(
    '/profile',
    AuthMiddleware.handle(),
    userController.getAuthenticatedUserProfile
)

module.exports = { basePath: '/users', router}