const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

const { baseUrl } = require('../config/config')

class UserService {
    #unionQuery

    constructor () {
        const select = 'name, username, email, phone, profile_picture AS profilePicture, created_at AS createdAt, deleted_at AS deletedAt'
        this.#unionQuery = `(
            SELECT id, 'illustrator' as role, ${select} FROM illustrators
            UNION
            SELECT id, 'consumer' as role, ${select} FROM consumers
        ) AS users`
    }
    
    async findAll(options = null) {

        let query = `SELECT * FROM ${this.#unionQuery}`

        const optionQuery = this.#createOptionQuery(options)

        query += optionQuery

        const data = await sequelize.query(
            query,
            {
                type: QueryTypes.SELECT
            }
        )

        for (const user of data) {
            let substr
            const profilePicture = ((substr = user.profilePicture?.substr(0, 4)) == 'http' || substr == undefined) ? user.profilePicture : `${baseUrl}/${user.profilePicture}`

            user.profilePicture = profilePicture
        }

        return data
    }

    async countUsers(options = null) {
        let query = `SELECT COUNT(users.id) as total FROM ${this.#unionQuery}`

        const optionQuery = this.#createOptionQuery(options)

        query += optionQuery

        const data = await sequelize.query(
            query,
            {
                type: QueryTypes.SELECT
            }
        )
        
        return Number(data[0].total)
    }

    #createOptionQuery(options) {
        let optionQuery = ''
        if (options) {
            if (options.where) {
                const whereQuery = []
                const where = options.where
                for (const item in where) {
                    if (where[item]) {
                        if (where[item] instanceof Object) {
                            const operator = Object.keys(where[item])[0]
                            if (where[item][operator] !== "'%undefined%'")
                                whereQuery.push(`${item} ${operator} ${where[item][operator]}`)
                        } else
                            whereQuery.push(`${item}='${where[item]}'`)
                    }
                }
                const whereLiteral = whereQuery.join(' AND ')
                if (whereLiteral)
                    optionQuery += ' WHERE ' + whereLiteral
            }

            if (options.limit) {
                const limitLiteral = ` LIMIT ${options.limit}`
                optionQuery += limitLiteral
            }

            if (options.offset) {
                const offsetLiteral = ` OFFSET ${options.offset}`
                optionQuery += offsetLiteral
            }
        }
        return optionQuery
    }
}

module.exports = UserService