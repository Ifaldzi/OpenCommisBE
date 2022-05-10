const response = require('../services/response')

class Controller {
    constructor() {
        this.response = response
    }

    generatePaginationData(dataCount, limit, page){
        return {
            totalData: dataCount,
            totalPage: Math.ceil(dataCount / limit),
            pageSize: limit,
            currentPage: page
        }
    }
}

module.exports = {
    Controller
}