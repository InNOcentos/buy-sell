"use strict";

const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);


const route = new Router();

module.exports = (app, categortyService) => {
  app.use(`/category`, route);

  route.get(`/`, async (req, res, next) => {
    try {
      const categories = await categortyService.findAll();

      res.status(HttpCode.OK).json(categories);
    } catch (error) {
      console.log(error.message)
    }
  });
};
