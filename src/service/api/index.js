"use strict";

const { Router } = require(`express`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);
const user = require(`../api/user`)
const { getLogger } = require(`../logs/logger`);
const logger = getLogger();

const database = require('../data-base');

const {
  CategoryService,
  OfferService,
  CommentService,
  UserService,
  RefreshTokenService,
} = require(`../data-service`);

const app = new Router();

(async () => {

  category(app, new CategoryService(database,logger),logger);
  search(app, new OfferService(database,logger),logger);
  offer(app, new OfferService(database,logger),new CommentService(database,logger), new UserService(database,logger),logger);
  user(app, new UserService(database,logger), new RefreshTokenService(logger), logger);
})();

module.exports = app;
