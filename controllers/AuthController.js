const { Controller } = require("./Controller");
const { BadRequestError } = require("../errors");
const jwt = require('jsonwebtoken')
const { jwt: jwtConfig, verificationRedirect, path } = require('../config/config')
const { Illustrator, Consumer, Administrator } = require('../models')
const { createJWT } = require('../services/jwtService');
const { CustomError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const MailService = require("../services/MailService");
const NotFoundError = require("../errors/NotFoundError");
const { moveFileWithPath } = require("../services/fileService");
const { ROLE } = require('../config/constants')

class AuthController extends Controller {
    constructor() {
        super()
        this.mailService = new MailService()
    }

    login = async (req, res, next) => {
        const { role } = req.query
        const loginData = req.body

        let user
        switch (role) {
            case ROLE.ILLUSTRATOR:
                user = await Illustrator.findOne({where: {email: loginData.email}})
                break;
            case ROLE.CONSUMER:
                user = await Consumer.findOne({where: {email: loginData.email}})
                break;
            case ROLE.ADMIN:
                user = await Administrator.findOne({ where: {username: loginData.username} })
                break;
            default:
                throw new CustomError("Role invalid", StatusCodes.BAD_REQUEST)
                break;
        }

        if (user) {
            const isPasswordMatch = await user.verifyPassword(loginData.password)
            if (isPasswordMatch) {
                const token = createJWT(user.id, role)
                res.cookie('token', token, { maxAge: 3600000 * 24 * 14, httpOnly: false })
                return this.response.sendSuccess(res, "Login success", {user, token, role})
            }
        }

        return this.response.sendError(res, "Password or username incorrect")
    }

    register = async (req, res, next) => {
        const {role} = req.params
        const userData = req.body

        const verificationToken = createJWT(null, null, '10m')

        userData.activationToken = verificationToken

        try {
            const { profilePicture } = userData

            if (profilePicture) {
                const filePath = await moveFileWithPath(profilePicture, path.profilePicture)

                userData.profilePicture = filePath
            }

            let user
            switch (role) {
                case 'illustrator':
                    user = await Illustrator.create(userData)
                    break;
                case 'consumer':
                    user = await Consumer.create(userData)
                    break;
                default:
                    next()
                    break;
            }
            this.mailService.sendEmailVerificationMail(user.email, {token: verificationToken, role})
            return this.response.sendSuccess(res, "Register user success", {user, role})
        } catch(error) {
            next(error)
        }
    }

    logout = async (req, res, next) => {
        res.clearCookie('token', { sameSite: 'none', secure: true})
        return this.response.sendSuccess(res, "Logout success")
    }

    checkToken = async (req, res, next) => {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            throw new BadRequestError("Token not provided")
        }

        const authToken = authHeader.split(' ')[1]

        try {
            const decodedAuthData = jwt.verify(authToken, jwtConfig.secretKey)
            const { role, userId } = decodedAuthData

            const user = await this.#findUser(role, { id: userId })
            if (!user)
                throw new Error("User not found")

            return this.response.sendSuccess(res, "Token valid", { tokenValid: true, role})
        } catch (error) {
            return this.response.sendSuccess(res, error.message || "Token invalid", { tokenValid: false, role: null })
        }
    }

    verifyEmail = async (req, res, next) => {
        const { token, role } = req.query

        let user
        switch (role) {
            case ROLE.ILLUSTRATOR:
                user = await Illustrator.findOne({ where: { activationToken: token } })
                break;
            case ROLE.CONSUMER:
                user = await Consumer.findOne({ where: { activationToken: token } })
                break;
        }

        if (!user)
            return res.redirect(verificationRedirect.failed) //ToDo: change to failed verify url in FE

        try {
            const decoded = jwt.verify(token, jwtConfig.secretKey)

            await user.update({ emailVerified: true, activationToken: null })
            return res.redirect(verificationRedirect.success)
        } catch(error) {
            return res.redirect(verificationRedirect.failed)
        }
    }

    resendVerificationEmail = async (req, res, next) => {
        const { id, role } = req.params
        console.log(id, role);

        const user = await this.#findUser(role, { id: id })

        console.log(user);

        if (!user)
            throw new NotFoundError('User not found')

        const activationToken = createJWT(null, null, '10m')

        try {
            await user.update({ activationToken })
            this.mailService.sendEmailVerificationMail(user.email, { token: activationToken, role })
            return this.response.sendSuccess(res, 'Verification mail has been sent', null)
        } catch (error) {
            next(error)
        }
    }

    async #findUser(role, whereStatement) {
        let user
        switch (role) {
            case ROLE.ILLUSTRATOR:
                user = await Illustrator.findOne({ where: whereStatement })
                break;
            case ROLE.CONSUMER:
                user = await Consumer.findOne({ where: whereStatement })
                break;
            case ROLE.ADMIN:
                user = await Administrator.findOne({ where: whereStatement })
        }

        return user
    }
}

module.exports = new AuthController()