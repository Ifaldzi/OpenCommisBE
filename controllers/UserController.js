const { ROLE } = require("../config/constants");
const { Controller } = require("./Controller");
const { Consumer, Illustrator } = require('../models')

class UserController extends Controller {
    constructor() {
        super()
    }

    getAuthenticatedUserProfile = async (req, res) => {
        const { userId, userRole: role } = req.auth

        const attributes = ['id', 'name', 'username', 'email', 'createdAt', 'updatedAt', 'emailVerified', 'profilePicture']
        let user
        if (role === ROLE.CONSUMER) {
            user = await Consumer.findOne({ where: { id: userId }, attributes })
        } else if (role === ROLE.ILLUSTRATOR) {
            user = await Illustrator.findOne({ where: { id: userId }, attributes })
        }
        
        return this.response.sendSuccess(res, 'Fetch data success', user)
    }
}

module.exports = new UserController()