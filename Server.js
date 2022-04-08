const express = require('express')
const {sequelize} = require('./models')
const config = require('./config/config')

const authRoute = require('./routes/auth')
const notFound = require('./middlewares/notFound')

class Server {
    #app
    #port

    constructor() {
        this.#app = express()
        this.#port = config.port

        this.#app.use(express.json())
        this.#app.use('/api/auth', authRoute)

        this.#app.use(notFound)
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