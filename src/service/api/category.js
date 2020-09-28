"use strict";

const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);


const route = new Router();

module.exports = (app, categortyService, logger) => {
  app.use(`/category`, route);

  route.get(`/`, async (req, res, next) => {
    try {
      const categories = await categortyService.findAll();

      return res.status(HttpCode.OK).json(categories);
    } catch (error) {
      logger.error(`Can't find categories. Error:${error.message}`)
    }
  });
};
