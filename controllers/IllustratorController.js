const { Controller } = require('./Controller')
const { Illustrator, Artwork, Portfolio, sequelize } = require('../models')
const NotFoundError = require('../errors/NotFoundError')
const { moveFile, deleteFile } = require('../services/fileService')
const { path } = require('../config/config')
const { StatusCodes } = require('http-status-codes')
const { STATUS } = require('../config/constants')

class IllustratorController extends Controller {
    constructor() {
        super()
    }

    getIllustratorPortfolio = async (req, res) => {
        const illustratorId = req.params.illustratorId || req.auth.userId

        console.log(illustratorId);

        const portfolio = await Illustrator.findOne({
            where: {
                id: illustratorId
            },
            include: [
                'portfolio', 'artworks', 
                {
                    association: 'commissions',
                    include: [
                        {
                            association: 'reviews',
                            attributes: [],
                            required: false
                        }
                    ],
                    attributes: {
                        include: [
                            [sequelize.fn('AVG', sequelize.col('commissions.reviews.rating')), 'overallRating']
                        ],
                        exclude: ['CategoryId', 'IllustratorId']
                    },
                },
            ],
            attributes: {
                include: [
                    [sequelize.literal(`(
                        SELECT COUNT(orders.id)
                        FROM orders
                        JOIN commission_posts as c ON c.id = orders.commission_post_id
                        WHERE
                            c.illustrator_id = Illustrator.id AND
                            orders.status = 'FINISHED'
                    )`), 
                    'ordersCompleted']
                ]
            },
            group: ['artworks.id', 'commissions.id', 'bio', 'instagram_acc', 'twitter_acc', 'facebook_acc']
        })

        if (!portfolio)
            throw new NotFoundError("Illustrator doesn't found, check the illustrator id")

        this.response.sendSuccess(res, 'Fetch data success', portfolio)
    }

    addArtwork = async (req, res, next) => {
        const { userId: illustratorId } = req.auth
        const { description } = req.body
        const artworkImage = req.file

        try {
            const filePath = await moveFile(artworkImage, path.artworkImage)

            const artwork = await Artwork.create({
                illustratorId, description, image: filePath
            })
            this.response.sendSuccess(res, 'Artwork added successfully', artwork, StatusCodes.CREATED)
        } catch (error) {
            next(error)
        }
    }

    deleteArtwork = async (req, res, next) => {
        const { artworkId } = req.params
        const { userId: illustratorId } = req.auth

        try {
            const artwork = await Artwork.findOneWhichBelongsToIllustrator(illustratorId, artworkId)
            await deleteFile(artwork.image)
            await artwork.destroy()

            this.response.sendSuccess(res, "Arwork deleted successfully", null)
        } catch (error) {
            next(error)
        }
    }

    updatePortfolio = async (req, res, next) => {
        const { userId: illustratorId } = req.auth
        const { phone, name, available, bio, facebook: facebookAcc, twitter: twitterAcc, instagram: instagramAcc } = req.body
        const profilePicture = req.file

        const illustratorData = { name, phone, available }

        try {
            const illustrator = await Illustrator.findOne({ where: { id: illustratorId } })
            
            if (profilePicture) {
                const filePath = await moveFile(profilePicture, path.profilePicture)
                if (illustrator.profilePicture)
                    await deleteFile(illustrator.profilePicture)
                illustratorData['profilePicture'] = filePath
            }

            await illustrator.update(illustratorData)

            const portfolio = await illustrator.getPortfolio()
            console.log(portfolio);
            if (!portfolio) {
                await illustrator.createPortfolio({ bio, facebookAcc, twitterAcc, instagramAcc })
            } else {
                await portfolio.update({ bio, facebookAcc, twitterAcc, instagramAcc })
            }

            await illustrator.reload({ include: ['portfolio'] })

            this.response.sendSuccess(res, "Portfolio updated successfully", illustrator)
        } catch (error) {
            next(error)
        }
    }

    getBalance = async (req, res, next) => {
        const { userId: illustratorId } = req.auth

        const illustratorBalanceData = await Illustrator.findOne({
            where: { id: illustratorId },
            attributes: ['id', 'name', 'username', 'balance']
        })

        return this.response.sendSuccess(res, 'Fetch data success', illustratorBalanceData)
    }
}

module.exports = new IllustratorController()