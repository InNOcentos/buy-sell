'use strict';

const {Router} = require('express');
const {getHomePage} = require('../controllers/main-controllers');
const mainRouter = new Router();

mainRouter.get(`/`, getHomePage);
mainRouter.get(`/sign-up`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, (req, res) => res.render(`search-result`));

module.exports = mainRouter;