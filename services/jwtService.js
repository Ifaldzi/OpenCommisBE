const jwt = require('jsonwebtoken')

const { jwt: jwtConfig } = require('../config/config')

exports.createJWT = (userId = null, role = null) => {
    return jwt.sign({
        userId, role
    }, jwtConfig.secretKey, {expiresIn: jwtConfig.lifetime})
}