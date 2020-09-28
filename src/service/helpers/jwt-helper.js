'use strict';

const jwt = require(`jsonwebtoken`);
const {jwt_access_secret, jwt_refresh_secret} = require(`../../config`);

module.exports.makeTokens = (tokenData) => {
    const accessToken = jwt.sign(tokenData, jwt_access_secret,  { expiresIn: `2h`});
    const refreshToken = jwt.sign(tokenData, jwt_refresh_secret);
    return {accessToken, refreshToken};
};