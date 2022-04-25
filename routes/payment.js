const { Router } = require('express')
const paymentController = require('../controllers/PaymentController')

const router = Router()

router.post('/callback', paymentController.paymentCallback)

module.exports = { basePath: '/payment', router}
