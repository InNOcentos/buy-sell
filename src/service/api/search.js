"use strict";
const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);

const route = new Router();

module.exports = (app, offerService) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res, next) => {
    const decodedQuery = decodeURI(req.query.query);

    if (!decodedQuery) {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid query`);
      return console.error(`Invalid query.`);
    }

    try {
      const foundedOffers = await offerService.findAllByTitle(decodedQuery);

      if (!foundedOffers.length) {
        res
          .status(HttpCode.NOT_FOUND)
          .send(`Not found offers which includes: ${decodedQuery}`);
        return console.error(
          `Not found offers which includes: ${decodedQuery}.`
        );
      }

      return res.status(HttpCode.OK).json(foundedOffers);
    } catch (error) {
      next(error);
    }

    return null;
  });
};