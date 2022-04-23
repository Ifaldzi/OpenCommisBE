const { Controller } = require("./Controller");
const { Order } = require('../models');
const { STATUS } = require("../config/constants");
const MailService = require("../services/MailService");

class PaymentController extends Controller {
    constructor() {
        super()
        this.mailService = new MailService()
    }

    paymentCallback = async (req, res, next) => {
        const { id, external_id: externalId, paid_at: paidAt, payment_channel: paymentChannel, status} = req.body

        const orderId = externalId.split('-')[1]
        const order = await Order.findOne({where: {id: orderId}, include: ['payment', 'commission', 'consumer']})
        // console.log(order.payment);
        try {
            if (status === 'PAID') {
                await order.update({
                    status: STATUS.ON_WORK
                })

                await order.payment.update({
                    paymentDate: paidAt,
                    paymentMethod: paymentChannel
                })

                this.mailService.sendOrderPaidMail(order)
            } else {
                await order.update({
                    status: STATUS.FAILED
                })

                this.mailService.sendPaymentExpiredMail(order)
            }

            return this.response.sendSuccess(res, "success", null)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new PaymentController()