'use strict';

const {HttpCode} = require('../../constants');

module.exports = (schema) => (
    async (req, res, next) => {
        const { comment } = req.body;
        console.log(comment)
        try {
           await schema.validateAsync({comment}, { abortEarly: false });
        } catch(err) {
            console.log(err.details)
            const { details } = err;
            res.status(HttpCode.UNPROCESSABLE_ENTITY).json(details);
            return;
        }
        next();
    }
);