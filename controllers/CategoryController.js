const { Controller } = require("./Controller");
const { Category } = require('../models')

class CategoryController extends Controller {
    constructor() {
        super()
    }

    getAllCategories = async (req, res, next) => {
        const categories = await Category.findAll()

        return this.response.sendSuccess(res, 'Fetch data success', categories)
    }
}

module.exports = new CategoryController()