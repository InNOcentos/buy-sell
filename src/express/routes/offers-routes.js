'use strict';

const {Router} = require('express');
const {getAddPost, postAddPost, getPostEdit,putPostEdit} = require(`../controllers/offers-controllers`);
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`)); // TODO: заменить с search

offersRouter.get(`/add`, getAddPost);
offersRouter.post(`/add`, postAddPost);

offersRouter.get(`/edit/:id`, getPostEdit);
offersRouter.post(`/edit/:id`, putPostEdit);

offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

module.exports = offersRouter;