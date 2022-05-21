const { Router } = require("express");
const userController = require("../controllers/UserController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = Router()

router.get(
    '/profile',
    AuthMiddleware.handle(),
    userController.getAuthenticatedUserProfile
)

router.get(
    '/count',
    AuthMiddleware.handle(),
    userController.getCountOfUser
)

router.get(
    '/',
    AuthMiddleware.handle(),
    userController.getAllUsers
)

router.delete(
    '/:role/:id',
    AuthMiddleware.handle(),
    userController.deleteUser
)

module.exports = { basePath: '/users', router}