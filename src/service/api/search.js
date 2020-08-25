'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {
  getLogger
} = require(`../logs/logger`);
const logger = getLogger();

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    logger.debug(`Start request to url /search`);

    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);

      logger.error(`End request with error ${res.statusCode}`);

      return;
    }

    const searchResults = service.findAll(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);

    logger.info(`End request with status code ${res.statusCode}`);
  });
};