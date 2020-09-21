'use strict';

const {LoginMessage, HttpCode} = require(`../../constants`);

module.exports = (store) => (
    async (req, res, next) => {
        const { username, password } = req.body;
        const existsUser = await store.findByEmail(username);

        if (!existsUser) {
            res.status(HttpCode.FORBIDDEN)
                .json({ message: LoginMessage.USER_NOT_EXISTS});

            return;
        }

        if (! await store.checkUser(existsUser, password)) {
            res.status(HttpCode.FORBIDDEN)
                .json({message: LoginMessage.WRONG_PASSWORD});

            return;
        }

        res.locals.user = existsUser;
        next();
    }
);