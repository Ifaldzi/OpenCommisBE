const { Controller } = require("./Controller");
const { CommissionPost, Review } = require('../models');
const NotFoundError = require("../errors/NotFoundError");

class ReviewController extends Controller {
    constructor() {
        super()
    }

    addReview = async (req, res, next) => {
        const { id: commissionId } = req.params
        const { userId: consumerId } = req.auth
        const { rating, comment } = req.body

        const commission = await CommissionPost.findOne({ where: { id: commissionId } })

        if (!commission)
            throw new NotFoundError()

        try {
            const review = await Review.create({
                consumerId,
                commissionPostId: Number(commissionId),
                rating,
                comment
            })

            return this.response.sendSuccess(res, 'Review added', review)
        } catch (error) {
            next(error)
        }
    }

    getAllReviewsByCommission = async (req, res) => {
        const { id: commissionId } = req.params

        const commission = await CommissionPost.findOne({ 
            where: { id: commissionId }, 
            include: [
                {
                    association: 'reviews',
                    include: [
                        {
                            association: 'consumer',
                            attributes: ['id', 'name', 'username', 'profilePicture']
                        }
                    ],
                    attributes: { exclude: 'consumerId' }
                }
            ] 
        })

        return this.response.sendSuccess(res, 'Fetch data success', commission.reviews)
    }

    deleteReview = async (req, res, next) => {
        const { id: reviewId } = req.params

        const review = await Review.findOne({ where: { id: reviewId } })

        if (!review)
            throw new NotFoundError()

        try {
            await review.destroy()
            this.response.sendSuccess(res, 'Review deleted', null)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ReviewController()