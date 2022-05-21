const { Router } = require("express");
const { ROLE } = require("../config/constants");
const dashboardController = require("../controllers/DashboardController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = Router()

router.get(
    '/',
    AuthMiddleware.handle(ROLE.ADMIN),
    dashboardController.getAllTransactions
)

router.get(
    '/summary',
    AuthMiddleware.handle(ROLE.ADMIN),
    dashboardController.sumTotalTransactionEachMonth
)

module.exports = { basePath: '/transactions', router}