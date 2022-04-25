const { TokenExpiredError } = require("jsonwebtoken")
const jwt = require("jsonwebtoken")
const { jwt: jwtConfig } = require('../config/config')
const { UnauthorizedError, ForbiddenError } = require("../errors")

class AuthMiddleware {

    handle(allowedRole = null) {
        return (req, res, next) => {
            const authHeader = req.headers.authorization
            let { token: authToken} = req.cookies

            if (!authHeader && !authToken) {
                throw new UnauthorizedError()
            }
            
            if (!authToken & !authHeader)
                authToken = authHeader.split(' ')[1]
            
            try {
                const decodedAuthData = jwt.verify(authToken, jwtConfig.secretKey)
                const {userId, role} = decodedAuthData
                
                if (allowedRole) {
                    if ((allowedRole instanceof Array && !allowedRole.includes(role)) 
                    || (typeof allowedRole == 'string' && allowedRole !== role)) {
                        // throw new ForbiddenError()
                        next(new ForbiddenError())
                    }
                }

                req.auth = { userId, userRole: role}
                next()
            } catch (error) {
                if (error instanceof TokenExpiredError)
                    throw new UnauthorizedError('Token expired, please login again')
                    
                throw new UnauthorizedError('Token invalid')
            }
        }
    }
}

module.exports = new AuthMiddleware()