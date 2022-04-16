require('dotenv').config()

module.exports = {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || 'http://127.0.0.1:5000',
    enviroment: process.env.NODE_ENV || 'development',
    hash: {
        saltRounds: Number(process.env.SALT_ROUNDS || 10)
    },
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY,
        lifetime: process.env.JWT_LIFETIME
    },
    pagination: {
        defaultLimitPerPage: 15,
    },
    path: {
        commissionImage: 'img/commission/',
        artworkImage: 'img/artworks/',
        profilePicture: 'img/profile/'
    }
}