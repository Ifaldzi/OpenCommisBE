const express = require('express')
require('express-async-errors')
const {sequelize} = require('./models')
const config = require('./config/config')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoute = require('./routes/auth')
const commissionRoute = require('./routes/commission')
const illustratorRoute = require('./routes/illustrator')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')
const useRoute = require('./routes')

class Server {
    #app
    #port

    constructor() {
        this.#app = express()
        this.#port = config.port

        this.#app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true
        }))

        this.#app.use(express.static('./public'))
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({extended: true}))
        this.#app.use(cookieParser())
        useRoute(this.#app)

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