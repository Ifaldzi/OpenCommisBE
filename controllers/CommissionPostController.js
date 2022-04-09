const { Controller } = require('./Controller')
const { CommissionPost, Category, Tag } = require('../models')
const { pagination } = require('../config/config')
const NotFoundError = require('../errors/NotFoundError')
const { Op } = require('sequelize')

class CommissionPostController extends Controller {
    constructor() {
        super()
    }

    // public access
    getAllCommissionPosts = async (req, res, next) => {
        const page = req.query.page || 1
        const limit = req.query.limit || pagination.defaultLimitPerPage

        try {
            const commissionPosts = await CommissionPost.findAndCountAll({
                include: [
                    {model: Category, as: 'category', required: true},
                    {model: Tag, as: 'tags', required: true, through: {attributes: []}}
                ],
                where: {
                    status: 'OPEN'
                },
                distinct: true,
                limit,
                offset: (page - 1) * limit
            })

            const paginationData = {
                totalData: commissionPosts.count,
                totalPage: Math.ceil(commissionPosts.count / limit),
                pageSize: limit,
                currentPage: page
            }
            
            return this.response.sendSuccess(res, 'Fetch data success', {
                commissionPosts: commissionPosts.rows, 
                pagination: paginationData
            })
        } catch (errors) {
            console.log(errors);
            return this.response.sendError(res, errors)
        }
    }

    getCommissionPost = async (req, res, next) => {
        const { id } = req.params

        const commission = await CommissionPost.findOne({
            where: {
                id
            },
            include: ['category', 'tags', 'illustrator']
        })

        if (!commission)
            throw new NotFoundError()
            
        return this.response.sendSuccess(res, 'Fetch data success', commission)
    }

    searchCommission = async (req, res, next) => {
        const { q: keyword } = req.query

        const page = req.query.page || 1
        const limit = req.query.limit || pagination.defaultLimitPerPage

        const wordsToFind = keyword.split(' ').join('|')

        const commissions = await CommissionPost.scope({method: ['pagination', limit, page]}).findAndCountAll({
            where: {
                [Op.or]: {
                    title: {
                        [Op.regexp]: wordsToFind
                    },
                    '$tags.tag_name$': {
                        [Op.regexp]: wordsToFind
                    }
                }
            },
            include: [
                {association: 'category'},
                {
                    association: "tags",
                    attributes: [],
                    through: {
                        attributes: []
                    },
                }
            ],
            distinct: true
        })

        const paginationData = this.#generatePaginationData(commissions, limit, page)

        this.response.sendSuccess(res, 'Fetch data success', {
            pagination: paginationData,
            commissionPosts: commissions.rows,
        })
    }

    #generatePaginationData(data, limit, page){
        return {
            totalData: data.count,
            totalPage: Math.ceil(data.count / limit),
            pageSize: limit,
            currentPage: page
        }
    }

    // authenticated illustrator only
    createCommissionPosts = (req, res, next) => {
        return this.response.sendSuccess(res, 'success', req.auth)
    }
}

module.exports = new CommissionPostController()