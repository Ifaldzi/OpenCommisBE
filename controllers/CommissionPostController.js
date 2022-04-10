const { Controller } = require('./Controller')
const { CommissionPost, Category, Tag } = require('../models')
const { pagination, path, baseUrl } = require('../config/config')
const NotFoundError = require('../errors/NotFoundError')
const { Op } = require('sequelize')
const { StatusCodes } = require('http-status-codes')
const { ForbiddenError } = require('../errors')
const fs = require('fs').promises

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
    createCommissionPosts = async (req, res, next) => {
        const { title, duration, price, description, category: categoryId, tags } = req.body
        const illustratorId = req.auth.userId
        const files = req.files
        
        const commissionData = {
            title,
            durationTime: duration,
            price,
            description,
            categoryId,
            illustratorId
        }

        try{
            for(let i=0; i<files.length; i++) {
                let filepath = path.commissionImage + files[i].filename
                await fs.rename(files[i].path, 'public/' + filepath)
                commissionData['image_' + String(i + 1)] = `${baseUrl}/${filepath}`
            }

            const commission = await CommissionPost.create(commissionData)

            await commission.setTags(tags)

            await commission.reload({
                include: ['category', 'tags', 'illustrator']
            })
            console.log(commission);
            
            return this.response.sendSuccess(res, 'success', commission, StatusCodes.CREATED)
        } catch (error) {
            next(error)
        }
    }

    getAllCommissionPostBelongToAuthenticatedUser = async (req, res, next) => {
        const illustratorId = req.auth.userId

        const commissions = await CommissionPost.findAll({
            where: {
                illustratorId
            }
        })

        return this.response.sendSuccess(res, 'Fetch data success', commissions)
    }

    updateCommissionPost = async (req, res, next) => {
        const { title, duration: durationTime, price, description, category: categoryId, tags } = req.body
        const { id: commisionId } = req.params
        const illustratorId = req.auth.userId

        const updateData = {
            title,
            durationTime,
            price,
            description,
            categoryId
        }

        try {
            const commission = await CommissionPost.findOne({
                where: {
                    id: commisionId
                }
            });

            if (!commission) {
                return next(new NotFoundError())
            }

            if (commission.illustratorId !== illustratorId) {
                return next(new ForbiddenError())
            }
            
            await commission.update(updateData)

            await commission.reload({include: ['category', 'tags', 'illustrator']})

            this.response.sendSuccess(res, 'Update data success', commission, StatusCodes.CREATED)
        } catch(error) {
            next(error)
        }
    }
}

module.exports = new CommissionPostController()