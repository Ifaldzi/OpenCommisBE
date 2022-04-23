const response = require('../services/response')

class Controller {
    constructor() {
        this.response = response
    }

    generatePaginationData(data, limit, page){
        return {
            totalData: data.count,
            totalPage: Math.ceil(data.count / limit),
            pageSize: limit,
            currentPage: page
        }
    }
}

module.exports = {
    Controller
}