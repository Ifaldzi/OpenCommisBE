const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

const useRoute = (app) => {
    fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
        })
        .forEach(file => {
            // app.use(basepath, route)
            const route = require(path.join(__dirname, file))
            app.use('/api' + route.basePath, route.router)
        })
}

module.exports = useRoute