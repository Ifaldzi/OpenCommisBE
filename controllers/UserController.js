const { ROLE } = require("../config/constants");
const { Controller } = require("./Controller");
const { Consumer, Illustrator } = require('../models');
const UserService = require("../services/UserService");
const { Op } = require("sequelize");
const { pagination } = require("../config/config");

class UserController extends Controller {
    constructor() {
        super()
        this.userService = new UserService()
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

    getAllUsers = async (req, res) => {
        const { role, q } = req.query

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || pagination.defaultLimitPerPage

        const where = { 
            role: role, 
            username: { 'like': `%${q}%` } 
        }

        const users = await this.userService.findAll({ 
            where,
            limit: limit,
            offset: (page - 1) * limit
        })

        const totalUsers = await this.userService.countUsers({ where })

        const paginationData = this.generatePaginationData(totalUsers, limit, page)

        return this.response.sendSuccess(res, 'Fetch data success', {pagination: paginationData, users})
    }
}

module.exports = new UserController()