"use strict";
const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);

const route = new Router();

module.exports = (app, offerService,logger) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res, next) => {
    const decodedQuery = decodeURI(req.query.query);
    
    if (!decodedQuery) {
      res.status(HttpCode.BAD_REQUEST).send(`Invalid query`);
      return logger.error(`Invalid query.`);
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
      logger.error(`Can't search offers. Error:${error.message}`)
      next(error);
    }

    return null;
  });

  route.get(`/:categoryId`, async (req, res, next) => {
    const {categoryId} = req.params;

    try {
      const offersByCategory = await offerService.findAllByCategory(categoryId);

      return res.status(HttpCode.OK).json(offersByCategory);
    } catch (error) {
      logger.error(`Can't get search/:id. Error:${error.message}`)
      next(error);
    }
  });
};