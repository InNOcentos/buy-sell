'use strict';

const {HttpCode} = require(`../../constants`);

const isOfferExists = ({service}) => async (req, res, next) => {
  const {offerId} = req.params;

  try {
    const isNotExists = !await service.isExists(offerId);

    if (isNotExists) {
      res.status(HttpCode.NOT_FOUND).send(`Not found offer with id: ${ offerId }`);

      return console.error(`Cant find offer with id: ${ offerId }.`);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

exports.isOfferExists = isOfferExists;