const { Router } = require("express");
const { ROLE } = require("../config/constants");
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
    AuthMiddleware.handle(ROLE.ADMIN),
    userController.getCountOfUser
)

router.get(
    '/',
    AuthMiddleware.handle(ROLE.ADMIN),
    userController.getAllUsers
)

router.delete(
    '/:role/:id',
    AuthMiddleware.handle(ROLE.ADMIN),
    userController.deleteUser
)

module.exports = { basePath: '/users', router}