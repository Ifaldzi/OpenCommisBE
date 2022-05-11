const { Controller } = require("./Controller");
const { Order, CommissionPost } = require('../models')

const { pagination } = require('../config/config');
const { Op } = require("sequelize");

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

    getAllCommissions = async (req, res) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || pagination.defaultLimitPerPage

        const { sort_by: sortBy, status, q: keyword } = req.query
        const orderBy = req.query.order_by?.toUpperCase() || 'ASC'

        const order = []
        if (sortBy)
            order.push([sortBy, orderBy])

        const where = {}
        if (status)
            where.status = status

        if (keyword) {
            const wordsToFind = keyword.split(' ').join('|')
            where[Op.or] = {
                title: {
                    [Op.regexp]: wordsToFind
                },
                '$tags.tag_name$': {
                    [Op.regexp]: wordsToFind
                }
            }
        }

        const commissions = await CommissionPost
                                .scope({ method: ['pagination', limit, page] })
                                .findAndCountAll({
                                    include: [
                                        'illustrator',
                                        {
                                            association: "tags",
                                            attributes: [],
                                            through: {
                                                attributes: []
                                            },
                                        }
                                    ],
                                    distinct: true,
                                    where,
                                    order
                                })

        const paginationData = this.generatePaginationData(commissions.count, limit, page)

        this.response.sendSuccess(res, 'Fetch data success', {pagination: paginationData, commissions: commissions.rows})
    }
}

module.exports = new DashboardController()