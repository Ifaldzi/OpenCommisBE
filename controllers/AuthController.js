const { Controller } = require("./Controller");
const { Illustrator } = require('../models')
const { createJWT } = require('../services/jwtService')

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
                        return this.response.sendSuccess(res, "Login success", {user, token})
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
                    return this.response.sendSuccess(res, "Register user success", user)
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
}

module.exports = new AuthController()