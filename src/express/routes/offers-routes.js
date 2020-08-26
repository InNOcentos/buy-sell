'use strict';

const {Router} = require('express');
const {getAddPost, getEditPost} = require('../controllers/offers-controllers');
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));
offersRouter.get(`/add`, getAddPost);
offersRouter.get(`/edit/:id`, getEditPost);
offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

module.exports = offersRouter;