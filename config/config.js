require('dotenv').config()

module.exports = {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || 'http://127.0.0.1:5000',
    enviroment: process.env.NODE_ENV || 'development',
    xenditSecretKey: process.env.XENDIT_SECRET_KEY,
    feBaseUrl: process.env.FE_BASE_URL || 'http://127.0.0.1:3000',
    verificationRedirect: {
        success: process.env.VERIFICATION_SUCCESS_URL,
        failed: process.env.VERIFICATION_FAILURE_URL
    },
    hash: {
        saltRounds: Number(process.env.SALT_ROUNDS || 10)
    },
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY,
        lifetime: process.env.JWT_LIFETIME
    },
    pagination: {
        defaultLimitPerPage: 15,
        defaultOrderPerPage: 5
    },
    path: {
        commissionImage: 'img/commission/',
        artworkImage: 'img/artworks/',
        profilePicture: 'img/profile/',
        referenceImage: 'img/order/ref/',
        verificationAsset: 'img/verification/'
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD
    },
    redirectUrl: {
        paymentSuccess: process.env.PAYMENT_SUCCESS_URL,
        paymentFailure: process.env.PAYMENT_FAILURE_URL
    }
}