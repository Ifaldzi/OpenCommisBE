const { Router } = require("express");
const { ROLE } = require("../config/constants");
const withdrawalController = require("../controllers/WithdrawalController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = Router()

router.post(
    '/create',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    withdrawalController.makeWithdrawal
)

router.post(
    '/callback',
    withdrawalController.disburseCallback
)

router.get(
    '/banks',
    withdrawalController.getAllBanksCode
)

router.get(
    '/',
    AuthMiddleware.handle(ROLE.ILLUSTRATOR),
    withdrawalController.getWithdrawalsByIllustrator
)

module.exports = { basePath: '/withdrawals', router }