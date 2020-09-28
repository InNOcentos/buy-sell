'use string';

const jwt = require(`jsonwebtoken`);
const {HttpCode} = require(`../../constants`);
const {jwt_access_secret} = require(`../../config`);

module.exports = (req, res, next) => {
    
    const authorization = req.headers[`authorization`]
    if (! authorization) {
        return res.sendStatus(HttpCode.UNAUTHORIZED);
    }
    
    const [, token] = authorization.split(` `);

    if (!token) {
        return res.sendStatus(HttpCode.UNAUTHORIZED);
    }

    jwt.verify(token, jwt_access_secret, (err, userData) => {
        
        if (err) {
            return res.sendStatus(HttpCode.FORBIDDEN);
        }
        res.locals.user = userData;
        res.locals.userToken = token;
        next()
    })
}
