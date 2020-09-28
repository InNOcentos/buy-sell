"use strict";

const { Router } = require(`express`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);
const user = require(`../api/user`)

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

  category(app, new CategoryService(database));
  search(app, new OfferService(database));
  offer(app, new OfferService(database), new CommentService(database), new UserService(database));
  user(app, new UserService(database), new RefreshTokenService());
})();

module.exports = app;
