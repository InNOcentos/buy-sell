'use strict';

const {Router} = require('express');
const {getHomePage, getSearch,get_signUpPage, post_signUpPage} = require('../controllers/main-controllers');
const {uploadFile, deleteFile} = require('../multer');
const mainRouter = new Router();

mainRouter.get(`/`, getHomePage);
mainRouter.get(`/sign-up`,deleteFile, get_signUpPage);
mainRouter.post(`/sign-up`, uploadFile, post_signUpPage);
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`,getSearch);

module.exports = mainRouter;