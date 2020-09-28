'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = ({service}) => (
    async (req, res, next) => {
        const {offerId:offer_id} = req.params;
        const {id: user_id} = res.locals.user;

        const haveRights = await service.checkRights(user_id,offer_id);

        if (!haveRights) {
            return res.status(HttpCode.FORBIDDEN)
                .send(`You have no access to do it`);
        }
        next();
    }
);