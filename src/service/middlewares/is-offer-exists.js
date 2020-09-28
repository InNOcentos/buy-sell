'use strict';

const {HttpCode} = require(`../../constants`);
const { getLogger } = require(`../logs/logger`);
const logger = getLogger();

module.exports = ({service}) => async (req, res, next) => {
  const {offerId} = req.params;

  try {
    const isNotExists = !await service.isExists(offerId);

    if (isNotExists) {
      res.status(HttpCode.NOT_FOUND).send(`Not found offer with id: ${ offerId }`);

      return logger.info(`Cant find offer with id: ${ offerId }.`);
    }
  } catch (error) {
    logger.error(`Error: ${ error.message }.`);
    next(error);
  }

  return next();
};