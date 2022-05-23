const { ROLE } = require("../config/constants");
const { Controller } = require("./Controller");
const { Consumer, Illustrator } = require('../models');
const UserService = require("../services/UserService");
const { Op } = require("sequelize");
const { pagination } = require("../config/config");
const { BadRequestError } = require("../errors");
const NotFoundError = require("../errors/NotFoundError");

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
            username: { 'like': `'%${q}%'` },
            deletedAt: { 'is': null }
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

    deleteUser = async (req, res, next) => {
        const { role, id: userId } = req.params

        let user
        const where = { id: userId }
        switch (role) {
            case ROLE.ILLUSTRATOR:
                user = await Illustrator.findOne({ where })
                break;
            case ROLE.CONSUMER:
                user = await Consumer.findOne({ where })
                break;
            default:
                throw new BadRequestError('Role not valid (illustrator & consumer only)')
                break;
        }

        if (!user)
            throw new NotFoundError()

        try {
            await user.destroy()

            return this.response.sendSuccess(res, 'User deleted successfull', null)
        } catch (error) {
            next(error)
        }
    }

    getCountOfUser = async (req, res) => {
        const illustratorCount = await this.userService.countUsers({ where: {role: ROLE.ILLUSTRATOR, deletedAt: { 'is': null }} })
        const consumerCount = await this.userService.countUsers({ where: { role: ROLE.CONSUMER, deletedAt: { 'is': null } } })

        return this.response.sendSuccess(res, 'Fetch data success', { illustrator: illustratorCount, consumer: consumerCount })
    }
}

module.exports = new UserController()