const { Controller } = require('./Controller')
const { CommissionPost, Category, Tag } = require('../models')

class CommissionPostController extends Controller {
    constructor() {
        super()
    }

    getAllCommissionPosts = async (req, res, next) => {
        const {page} = req.query

        const limit = 10

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
                offset: (page - 1) * 10 || 0
            })

            const paginationData = {
                count: commissionPosts.count,
                pageCount: Math.ceil(commissionPosts.count / limit),
                currentPage: page
            }
            // res.setHeader('pagination-data', paginationData)
            // console.log(commissionPosts[0].illustrator);
            return this.response.sendSuccess(res, 'Fetch data success', {commissionPosts: commissionPosts.rows, paginationData})
        } catch (errors) {
            console.log(errors);
            return this.response.sendError(res, errors)
        }
    }
}

module.exports = new CommissionPostController()