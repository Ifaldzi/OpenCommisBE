const { Controller } = require("./Controller");
const { Tag } = require('../models');
const { StatusCodes } = require("http-status-codes");

class TagController extends Controller {
    constructor() {
        super()
    }

    getAllTags = async (req, res) => {
        const tags = await Tag.findAll()

        return this.response.sendSuccess(res, 'Fetch data success', tags)
    }

    createTag = async (req, res, next) => {
        const {name: tagName} = req.body

        try {
            const tag = await Tag.create({ tagName })

            return this.response.sendSuccess(res, 'Data created successfully', tag, StatusCodes.CREATED)
        } catch(error) {
            next(error)
        }
    }
}

module.exports = new TagController()