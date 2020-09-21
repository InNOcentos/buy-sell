'use strict';

const {HttpCode} = require('../../constants');

module.exports = (schema) => (
    async (req, res, next) => {
        const {firstName, lastName, email, password, avatar, repeat} = req.body;
        try {
            console.log({firstName, lastName, email, password, avatar, repeat});
           await schema.validateAsync({firstName, lastName, email, password, avatar, repeat}, { abortEarly: false });
        } catch(err) {
            const { details } = err;
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({details,avatar});
        }

        next();
    }
);