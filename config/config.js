require('dotenv').config()

module.exports = {
    port: process.env.PORT || 3000,
    hash: {
        saltRounds: Number(process.env.SALT_ROUNDS || 10)
    },
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY,
        lifetime: process.env.JWT_LIFETIME
    }
}