const jwt = require('jsonwebtoken')

const { jwt: jwtConfig } = require('../config/config')

exports.createJWT = (userId = null, role = null, expires = jwtConfig.lifetime) => {
    return jwt.sign({
        userId, role
    }, jwtConfig.secretKey, {expiresIn: expires})
}