const { BadRequestError } = require("../errors");
const { Controller } = require("./Controller");
const { Order, CommissionPost, Sequelize, Payment } = require('../models');
const { moveFile, deleteFile } = require("../services/fileService");
const { path } = require("../config/config");
const MailService = require("../services/MailService");
const { ROLE, STATUS } = require("../config/constants");
const { pagination } = require('../config/config');
const NotFoundError = require("../errors/NotFoundError");
const PaymentService = require("../services/PaymentService");
const fs = require('fs')

class OrderController extends Controller {
    constructor() {
        super()
        this.mailService = new MailService()
    }

    makeOrder = async (req, res, next) => {
        const {commissionId, requestDetail} = req.body
        const { userId: consumerId } = req.auth
        const referenceImage = req.file

        const commission = await CommissionPost.findOne({
            where: {
                id: commissionId
            }
        })

        if (!commission)
            throw new BadRequestError("Commission post not available")

        try {
            const orderData = {
                grandTotal: commission.price,
                commissionPostId: Number(commissionId),
                consumerId,
                detail: {
                    requestDetail
                }
            }
            if (referenceImage) {
                const filePath = await moveFile(referenceImage, path.referenceImage)
                orderData.detail.referenceImage = filePath
            }

            const order = await Order.create(
                orderData, 
                {
                    include: ['detail']
                }
            )

            await order.reload({include: ['detail', 'consumer', 'commission']})

            const illustrator = await order.commission.getIllustrator()

            this.mailService.sendNotification(illustrator.email, 'Ada pesanan masuk, segera lakukan konfirmasi')

            return this.response.sendSuccess(res, "Order created", order)
        } catch (error) {
            next(error)
        }
    }

    getAllOrdersBelongToUser = async (req, res, next) => {
        const { userId, userRole: role } = req.auth
        
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || pagination.defaultLimitPerPage

        const OrderWithPagination = Order.scope({method: ['pagination', limit, page]})
        let orders
        switch (role) {
            case ROLE.CONSUMER:
                orders = await OrderWithPagination.findAndCountAll({
                    where: {consumerId: userId},
                    include: ['consumer', 'commission'],
                    order: [['orderDate', 'DESC']],
                    distinct: true
                })
                break;
            case ROLE.ILLUSTRATOR:
                orders = await OrderWithPagination.findAndCountAll({
                    where: {'$commission.illustrator_id$': userId},
                    include: ['consumer', 'commission'],
                    order: [['orderDate', 'DESC']],
                    distinct: true
                })
                break;
        }

        const paginationData = super.generatePaginationData(orders, limit, page)

        return this.response.sendSuccess(res, "Fetch data success", {pagination: paginationData, orders: orders.rows})
    }

    getDetailOrder = async (req, res) => {
        const { id: orderId } = req.params

        const order = await Order.findOne({
            where: {id: orderId},
            include: ['detail', 'consumer', 'commission', 'payment']
        })

        if (!order)
            throw new NotFoundError()

        return this.response.sendSuccess(res, "Fetch data success", order)
    }

    confirmOrder = async (req, res, next) => {
        const { id: orderId } = req.params
        const { accept, rejectionReason } = req.body
        const { userId } = req.auth

        try {
            const order = await Order.findOneWhichBelongsToIllustrator(orderId, userId)
            
            if (accept == true) {
                await order.update({ status: STATUS.ACCEPTED})

                this.mailService.sendConfirmationMail(order)
            } else {
                if (!rejectionReason)
                    throw new BadRequestError('Rejection reason not provided')
                
                await order.update({ status: STATUS.DENIED })

                this.mailService.sendRejectionMail(order, rejectionReason)
            }

            return this.response.sendSuccess(res, "Order confirmed successfully", order)
        } catch (error) {
            next(error)
        }
    }

    getOrdersByCommissionId = async (req, res, next) => {
        const { id: commissionId } = req.params
        const { userId: illustratorId } = req.auth

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || pagination.defaultOrderPerPage

        try {
            await CommissionPost.findOneByIdFromIllustrator(commissionId, illustratorId)
        } catch (error) {
            return next(error)
        }

        const orders = await Order.scope({method: ['pagination', limit, page]}).findAndCountAll({
            where: { commissionPostId: commissionId },
            order: [
                [Sequelize.literal("status='FAILED',status='FINISHED',status='DENIED',status='SENT',status='NOT_PAID',status='ACCEPTED',status='ON_WORK',status='CREATED'"), 'ASC'],
                ['orderDate', 'ASC'],
            ],
            include: ['consumer'],
            distinct: true
        })

        const paginationData = this.generatePaginationData(orders, limit, page)

        return this.response.sendSuccess(res, "Fetch data success", { pagination: paginationData, orders: orders.rows})
    }

    createPayment = async (req, res, next) => {
        const { id: orderId } = req.params
        const { method } = req.body

        const order = await Order.findOne({ where: { id: orderId } })

        if (!order)
            throw new NotFoundError()

        let payment = await order.getPayment()
        if (payment) {
            return this.response.sendSuccess(res, "Payment created", {paymentLink: payment.paymentLink, order})
        }
            
        // create invoice in xendit
        const paymentService = new PaymentService()
        const invoice = await paymentService.createInvoice(order, method)

        payment = await Payment.create({
            paymentLink: invoice.invoice_url,
            invoiceRefId: invoice.id,
            orderId: order.id
        })

        await order.update({
            status: STATUS.NOT_PAID,
            paymentId: payment.id
        })

        return this.response.sendSuccess(res, "Payment created", {paymentLink: invoice.invoice_url, order})
    }

    uploadSubmissionFile = async (req, res) => {
        const submissionFile = req.file

        return this.response.sendSuccess(res, 'File uploaded', {path: submissionFile.path})
    }

    sendSubmission = async (req, res, next) => {
        const { description, link, submissionFile } = req.body
        const { id: orderId } = req.params
        const { userId: illustratorId } = req.auth

        try {
            const order = await Order.findOneWhichBelongsToIllustrator(orderId, illustratorId)

            await this.mailService.sendOrderSubmission(order, { filePath: submissionFile, link}, description)
            
            await order.update({
                status: STATUS.SENT
            })

            if (submissionFile) {
                fs.unlink(submissionFile, (err) => {
                    if (err)
                        console.log(err);
                    console.log('file deleted');
                })
            }

            return this.response.sendSuccess(res, 'Submission sent successfully', order)
        } catch (error) {
            next(error)
        }
    }

    finishOrder = async (req, res, next) => {
        const { id: orderId } = req.params
        const { userId: consumerId } = req.auth

        try {
            const order = await Order.findOneWhichBelongsToConsumer(orderId, consumerId)

            await order.update({ status: STATUS.FINISHED })

            const illustrator = await order.commission.getIllustrator()

            const serviceFee = order.grandTotal * (5 / 100)
            await illustrator.addBalance(order.grandTotal - serviceFee)

            return this.response.sendSuccess(res, 'Order status updated', order)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new OrderController()