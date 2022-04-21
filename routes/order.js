const { Router } = require("express");
const { ROLE } = require("../config/constants");
const orderController = require("../controllers/OrderController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = Router()

router.post(
    '/checkout',
    AuthMiddleware.handle(ROLE.CONSUMER),
    upload.single('reference'),
    orderController.makeOrder
)

router.get(
    '/',
    AuthMiddleware.handle(),
    orderController.getAllOrdersBelongToUser
)

router.get(
    '/:id',
    AuthMiddleware.handle(),
    orderController.getDetailOrder
)

router.post(
    '/:id/confirm',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    orderController.confirmOrder
)

router.post(
    '/:id/pay',
    AuthMiddleware.handle(ROLE.CONSUMER),
    orderController.createPayment
)

module.exports = { basePath: '/orders', router}