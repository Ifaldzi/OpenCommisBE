const { Controller } = require('./Controller')
const { CommissionPost, Category, Tag } = require('../models')
const { pagination } = require('../config/config')

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
                    {model: Tag, as: 'tags', required: true}
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

    // authenticated illustrator only
    createCommissionPosts = (req, res, next) => {
        return this.response.sendSuccess(res, 'success', req.auth)
    }
}

module.exports = new CommissionPostController()