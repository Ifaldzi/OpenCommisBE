const { Controller } = require('./Controller')
const { CommissionPost, Category, Tag, sequelize } = require('../models')
const { pagination, path, baseUrl } = require('../config/config')
const NotFoundError = require('../errors/NotFoundError')
const { Op } = require('sequelize')
const { StatusCodes } = require('http-status-codes')
const { ForbiddenError } = require('../errors')
const { STATUS } = require('../config/constants')
const fs = require('fs').promises

class CommissionPostController extends Controller {
    constructor() {
        super()
    }

    // public access
    getAllCommissionPosts = async (req, res, next) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || pagination.defaultLimitPerPage
        const { category } = req.query

        const where = {
            status: 'OPEN'
        }

        if (category)
            where.categoryId = category

        try {
            const commissionPosts = await CommissionPost.scope({method: ['pagination', limit, page]}).findAll({
                where: where,
                include: [
                    {association: 'illustrator'},
                    {
                        association: 'reviews',
                        attributes: [],
                        required: false
                    },
                    {
                        association: 'orders',
                        attributes: [],
                        where: { status: STATUS.FINISHED },
                        required: false
                    }
                ],
                attributes: {
                    include: [
                        [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'overallRating'],
                        [sequelize.literal('COUNT(DISTINCT(orders.id))'), 'ordersCompleted']
                    ]
                },
                group: ['CommissionPost.id'],
                order: [
                    [sequelize.literal('overallRating'), 'DESC'],
                    [sequelize.literal('ordersCompleted'), 'DESC']
                ]
            })

            const count = await CommissionPost.count({where: {status: 'OPEN'}})

            const paginationData = this.#generatePaginationData(count, limit, page)
            
            return this.response.sendSuccess(res, 'Fetch data success', {
                pagination: paginationData,
                commissionPosts: commissionPosts, 
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
            include: [
                'category', 'tags', 'illustrator', 'reviews',
                {
                    association: 'orders',
                    attributes: [],
                    where: { status: STATUS.FINISHED },
                }
            ],
            attributes: {
                include: [
                    [sequelize.literal('COUNT(DISTINCT(orders.id))'), 'ordersCompleted'],
                    [
                        sequelize.literal(`(
                            SELECT AVG(reviews.rating)
                            FROM reviews
                            WHERE
                                reviews.commission_post_id = CommissionPost.id
                        )`)
                        ,
                        'overallRating'
                    ]
                ]
            },
            nested: true,
            group: ['tags.id', 'reviews.id'],
        })

        if (!commission)
            throw new NotFoundError()
            
        return this.response.sendSuccess(res, 'Fetch data success', commission)
    }

    searchCommission = async (req, res, next) => {
        const { q: keyword } = req.query

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || pagination.defaultLimitPerPage

        const wordsToFind = keyword.split(' ').join('|')

        const commissions = await CommissionPost.scope(
            'withOverallRatingAndOrdersCompleted', 
            {method: ['pagination', limit, page]}
        ).findAll({
            where: {
                [Op.or]: {
                    title: {
                        [Op.regexp]: wordsToFind
                    },
                    '$tags.tag_name$': {
                        [Op.regexp]: wordsToFind
                    }
                },
                status: 'OPEN'
            },
            include: [
                {association: 'illustrator'},
                {
                    association: "tags",
                    attributes: [],
                    through: {
                        attributes: []
                    },
                }
            ],
            order: [
                [sequelize.literal('overallRating'), 'DESC'],
                [sequelize.literal('ordersCompleted'), 'DESC']
            ]
        })
        console.log(commissions);
        const dataCount = await CommissionPost
            .scope({method: ['search', wordsToFind]})
            .count({ distinct: true, col: 'CommissionPost.id' })

        const paginationData = this.#generatePaginationData(dataCount, limit, page)

        this.response.sendSuccess(res, 'Fetch data success', {
            pagination: paginationData,
            commissionPosts: commissions,
        })
    }

    #generatePaginationData(dataCount, limit, page){
        return {
            totalData: dataCount,
            totalPage: Math.ceil(dataCount / limit),
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
                commissionData['image_' + String(i + 1)] = filepath
            }

            const commission = await CommissionPost.create(commissionData)

            await commission.setTags(tags)

            await commission.reload({
                include: ['category', 'tags', 'illustrator']
            })
            
            return this.response.sendSuccess(res, 'success', commission, StatusCodes.CREATED)
        } catch (error) {
            next(error)
        }
    }

    getAllCommissionPostBelongToAuthenticatedUser = async (req, res, next) => {
        const illustratorId = req.auth.userId

        const commissions = await CommissionPost.scope('defaultScope', 'withOverallRatingAndOrdersCompleted').findAll({
            where: {
                illustratorId
            }
        })

        return this.response.sendSuccess(res, 'Fetch data success', commissions)
    }

    updateCommissionPost = async (req, res, next) => {
        const { title, duration: durationTime, price, description, status, category: categoryId, tags } = req.body
        const { id: commisionId } = req.params
        const illustratorId = req.auth.userId

        const images = req.files

        const updateData = {
            title,
            durationTime,
            price,
            description,
            status: status,
            categoryId
        }

        try {
            const commission = await CommissionPost.findOneByIdFromIllustrator(commisionId, illustratorId)

            if (images) {
                for (const key of Object.keys(images)) {
                    const image = images[key][0]
                    const filePath = path.commissionImage + image.filename
                    
                    await fs.rename(image.path, 'public/' + filePath)
                    updateData[key] = filePath

                    if (commission[key]) {
                        // delete old image
                        await fs.unlink('public/' + commission[key])
                    }
                }
            }
            
            await commission.update(updateData)

            if (tags) {
                await commission.setTags(tags)
            }

            await commission.reload({include: ['category', 'tags', 'illustrator']})

            this.response.sendSuccess(res, 'Update data success', commission, StatusCodes.CREATED)
        } catch(error) {
            next(error)
        }
    }

    deleteCommissionPost = async (req, res, next) => {
        const { id: commisionId } = req.params
        const { userId: illustratorId} = req.auth

        try {
            const commission = await CommissionPost.findOneByIdFromIllustrator(commisionId, illustratorId)
            
            for (let i = 1; i <= 4; i++) {
                const imagePath = commission['image_' + i]
                if (imagePath)
                    await fs.unlink('public/' + imagePath)
            }

            await commission.destroy()
            return this.response.sendSuccess(res, 'Data deleted success', null)
        } catch(error) {
            next(error)
        }
    }
}

module.exports = new CommissionPostController()