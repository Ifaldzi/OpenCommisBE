const { BadRequestError } = require("../errors");
const { Controller } = require("./Controller");
const { Order, CommissionPost } = require('../models');
const { moveFile } = require("../services/fileService");
const { path } = require("../config/config");
const MailService = require("../services/MailService");
const { ROLE, STATUS } = require("../config/constants");
const { pagination } = require('../config/config');
const NotFoundError = require("../errors/NotFoundError");

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
                    distinct: true
                })
                break;
            case ROLE.ILLUSTRATOR:
                orders = await OrderWithPagination.findAndCountAll({
                    where: {'$commission.illustrator_id$': userId},
                    include: ['consumer', 'commission'],
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
            include: ['detail', 'consumer', 'commission']
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
        const limit = Number(req.query.limit) || pagination.defaultLimitPerPage

        try {
            await CommissionPost.findOneByIdFromIllustrator(commissionId, illustratorId)
        } catch (error) {
            return next(error)
        }

        const orders = await Order.scope({method: ['pagination', limit, page]}).findAndCountAll({
            where: { commissionPostId: commissionId },
            include: ['consumer'],
            distinct: true
        })

        const paginationData = this.generatePaginationData(orders, limit, page)

        return this.response.sendSuccess(res, "Fetch data success", { pagination: paginationData, orders: orders.rows})
    }
}

module.exports = new OrderController()