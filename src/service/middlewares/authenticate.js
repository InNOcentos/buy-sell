'use strict';

const {loginMessage, HttpCode} = require(`../../constants`);

module.exports = ({service}) => (
    async (req, res, next) => {
        const {email, password} = req.body;
        const existsUser = await service.isExists(email);

        if (!existsUser) {
            res.status(HttpCode.FORBIDDEN)
                .json({userNotFound: loginMessage.USER_NOT_EXIST});

            return;
        }

        if (! await service.checkUser(existsUser, password)) {
            res.status(HttpCode.FORBIDDEN)
                .json({userNotFound: loginMessage.USER_NOT_EXIST});

            return;
        }
        
        res.locals.user = existsUser.dataValues;
        next();
    }
);