'use strict';

const {Router} = require('express');
const {getAddPost, postAddPost, getPostEdit,putPostEdit,get_offerById} = require(`../controllers/offers-controllers`);
const uploadFile = require('../multer');
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`)); // TODO: заменить с search

offersRouter.get(`/add`, getAddPost);
offersRouter.post(`/add`, uploadFile, postAddPost);

offersRouter.get(`/edit/:id`, getPostEdit);
offersRouter.post(`/edit/:id`, uploadFile, putPostEdit);

offersRouter.get(`/:id`, get_offerById);

module.exports = offersRouter;