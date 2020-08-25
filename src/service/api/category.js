'use strict';

const {
  Router
} = require(`express`);

const {
  HttpCode
} = require(`../../constants`);

const {
  getLogger
} = require(`../logs/logger`);
const logger = getLogger();

const route = new Router();

module.exports = (app, service) => {
  app.use(`/category`, route);

  route.get(`/`, (req, res) => {
    logger.debug(`Start request to url /category`);

    const categories = service.findAll();
    res.status(HttpCode.OK).json(categories);
    
    logger.info(`End request with status code ${res.statusCode}`);
  });
};
