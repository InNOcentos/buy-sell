'use strict';

const {HttpCode} = require('../../constants');

module.exports = (schema) => (
    async (req, res, next) => {
        const {category, description, picture, title, type, sum} = req.body;
        try {
           await schema.validateAsync({category, description, picture, title, type, sum}, { abortEarly: false });
        } catch(err) {
            const { details } = err;
            res.status(HttpCode.UNPROCESSABLE_ENTITY).json(details);
            return;
        }

        next();
    }
);