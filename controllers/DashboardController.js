const { Controller } = require("./Controller");
const { Order } = require('../models')

const { pagination } = require('../config/config')

class DashboardController extends Controller {
    constructor() {
        super()
    }

    getAllTransactions = async (req, res) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || pagination.defaultLimitPerPage

        const orders = await Order.scope({method: ['pagination', limit, page]}).findAndCountAll({
            include: [
                'consumer', 'payment', {
                    association: 'commission',
                    paranoid: false,
                    include: ['illustrator']
                }
            ],
            order: [['orderDate', 'DESC']],
            distinct: true
        })
        // console.log(orders);
        const mappedOrder = orders.rows.map(order => {
            return {
                id: order.id,
                commission: order.commission.name,
                illustrator: order.commission.illustrator.name,
                consumer: order.consumer.name,
                orderDate: order.orderDate,
                paymentMethod: order.payment == null ? null : order.payment.paymentMethod,
                grandTotal: order.grandTotal
            }
        })

        const paginationData = this.generatePaginationData(orders.count, limit, page)

        this.response.sendSuccess(res, 'Fetch data success', {pagination: paginationData, transactions: mappedOrder})
    }
}

module.exports = new DashboardController()