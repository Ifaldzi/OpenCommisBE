const { Controller } = require('./Controller')
const { Illustrator, Artwork, Portfolio, sequelize, VerificationSubmission } = require('../models')
const NotFoundError = require('../errors/NotFoundError')
const { moveFile, deleteFile, moveFileFromTemp } = require('../services/fileService')
const { path } = require('../config/config')
const { StatusCodes } = require('http-status-codes')
const { STATUS } = require('../config/constants')
const { BadRequestError } = require('../errors')
const MailService = require('../services/MailService')

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
                            include: [
                                {
                                    association: 'consumer',
                                    attributes: [],
                                    required: true
                                }
                            ],
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

    verifyAccount = async (req, res, next) => {
        const { nik, address, province, city, idCard, cardSelfie, background } = req.body
        const { userId: illustratorId } = req.auth

        try {
            const idCardPath = await moveFileFromTemp(idCard, path.verificationAsset)
            const cardSelfiePath = await moveFileFromTemp(cardSelfie, path.verificationAsset)
    
            const verificationSubmissionData = { 
                NIK: nik, address, province, city, background,
                idCardPhoto: idCardPath,
                cardSelfiePhoto: cardSelfiePath,
                submissionDate: new Date(),
                illustratorId
            }

            const illustrator = await Illustrator.findOne({ where: { id: illustratorId } })
    
            let verificationSubmission = await illustrator.getVerificationSubmission()
            
            if (verificationSubmission) {
                await deleteFile(verificationSubmission.idCardPhoto)
                await deleteFile(verificationSubmission.cardSelfiePhoto)
                
                await verificationSubmission.update(verificationSubmissionData)
            } else {
                verificationSubmission = await illustrator.createVerificationSubmission(verificationSubmissionData)
            }
    
            return this.response.sendSuccess(res, 'Data created successfully', verificationSubmission)
        } catch (error) {
            next(error)
        }
    }

    approveVerificationSubmission = async (req, res, next) => {
        const { accepted, illustrator_id: illustratorId } = req.body

        const illustrator = await Illustrator.findOne({ 
            where: { id: illustratorId },
            include: [{
                association: 'verificationSubmission',
            }]
        })

        if (!illustrator)
            throw new NotFoundError('Illustrator with given id not found')

        const verificationSubmission = illustrator.verificationSubmission

        if (!verificationSubmission.submissionDate)
            throw new NotFoundError('This illustrator has not submitted the verification submission yet')

        if (verificationSubmission.accepted)
            throw new BadRequestError('This verification submission has been approved')

        await verificationSubmission.update({
            accepted,
            verificationDate: new Date()
        })

        if (accepted) {
            await illustrator.update({ verified: accepted })
        }

        const mailService = new MailService()
        mailService.sendAccountVerificationApproval(illustrator.email, accepted)

        return this.response.sendSuccess(res, 'Data saved successfully', verificationSubmission)
    }

    getIllustratorsWhoSubmittedAccountVerification = async (req, res) => {
        const illustrators = await Illustrator.findAll({
            include: [
                {
                    association: 'verificationSubmission',
                    required: true,
                    attributes: []
                }
            ],
            order: [['verificationSubmission', 'submissionDate', 'DESC']]
        })

        return this.response.sendSuccess(res, 'Fetch data success', illustrators)
    }

    getVerificationSubmissionDetail = async (req, res) => {
        const { illustratorId } = req.params

        const verificationSubmission = await VerificationSubmission.findOne({
            where: { illustratorId },
            include: [
                {
                    association: 'illustrator'
                }
            ],
            attributes: {
                exclude: ['illustratorId']
            }
        })

        if (!verificationSubmission)
            throw new NotFoundError('Data not found')

        return this.response.sendSuccess(res, 'Fetch data success', verificationSubmission)
    }
}

module.exports = new IllustratorController()