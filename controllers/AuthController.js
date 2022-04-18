const { Controller } = require("./Controller");
const { Illustrator } = require('../models')
const { createJWT } = require('../services/jwtService');
const { BadRequestError } = require("../errors");
const jwt = require('jsonwebtoken')
const { jwt: jwtConfig } = require('../config/config')

const ROLE = {
    ILLUSTRATOR: 'illustrator',
    CONSUMER: 'consumer'
}

class AuthController extends Controller {
    constructor() {
        super()
    }

    login = async (req, res, next) => {
        const { role } = req.query
        const loginData = req.body

        switch (role) {
            case ROLE.ILLUSTRATOR:
                const user = await Illustrator.findOne({where: {email: loginData.email}})
                if (user) {
                    const isPasswordMatch = await user.verifyPassword(loginData.password)
                    if (isPasswordMatch) {
                        const token = createJWT(user.id, role)
                        res.cookie('token', token, { maxAge: 3600000 * 24 * 14, httpOnly: false })
                        return this.response.sendSuccess(res, "Login success", {user, token, role})
                    }
                }
                return this.response.sendError(res, "Password or username incorrect")
            case ROLE.CONSUMER:
                return this.response.sendError(res, "This feature is not available right now")
            default:
                next()
                break;
        }
    }

    register = async (req, res, next) => {
        const {role} = req.params
        const userData = req.body

        try {
            switch (role) {
                case 'illustrator':
                    const user = await Illustrator.create(userData)
                    return this.response.sendSuccess(res, "Register user success", {user, role})
                case 'consumer':
                    return this.response.sendError(res, "This feature is not available right now")
                default:
                    next()
                    break;
            }
        } catch(error) {
            return this.response.sendError(res, error)
        }
    }

    logout = async (req, res, next) => {
        res.clearCookie('token')
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
            const { role } = decodedAuthData

            return this.response.sendSuccess(res, "Token valid", { tokenValid: true, role})
        } catch (errors) {
            return this.response.sendSuccess(res, "Token invalid", { tokenValid: false, role: null })
        }
    }
}

module.exports = new AuthController()