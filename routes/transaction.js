const { Router } = require("express");
const dashboardController = require("../controllers/DashboardController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = Router()

router.get(
    '/',
    AuthMiddleware.handle(),
    dashboardController.getAllTransactions
)

module.exports = { basePath: '/transactions', router}