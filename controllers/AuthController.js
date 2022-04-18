const { Controller } = require("./Controller");
const { Illustrator, Consumer } = require('../models')
const { createJWT } = require('../services/jwtService');
const { CustomError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

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

        let user
        switch (role) {
            case ROLE.ILLUSTRATOR:
                user = await Illustrator.findOne({where: {email: loginData.email}})
                break;
            case ROLE.CONSUMER:
                user = await Consumer.findOne({where: {email: loginData.email}})
                break
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

        try {
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
            return this.response.sendSuccess(res, "Register user success", {user, role})
        } catch(error) {
            next(error)
        }
    }

    logout = async (req, res, next) => {
        res.clearCookie('token')
        return this.response.sendSuccess(res, "Logout success")
    }
}

module.exports = new AuthController()