const express = require('express')
const {sequelize} = require('./models')
const config = require('./config/config')

const authRoute = require('./routes/auth')
const commissionRoute = require('./routes/commission')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

class Server {
    #app
    #port

    constructor() {
        this.#app = express()
        this.#port = config.port

        this.#app.use(express.json())
        this.#app.use('/api/auth', authRoute)
        this.#app.use('/api/commissions', commissionRoute)

        this.#app.use(notFound)
        this.#app.use(errorHandler)
    }

    run() {
        this.#app.listen(this.#port, async () => {
            try {
                await sequelize.authenticate()
                console.log(`The server is running on port ${this.#port}`);
            } catch(error) {
                console.log("Unable connect to database", error);
            }
        })
    }
}

module.exports = { server: new Server() }