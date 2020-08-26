'use strict';

const {Router} = require('express');
const {getMyPage,getMyComments} = require(`../controllers/my-controllers`);
const myRouter = new Router();

myRouter.get(`/`, getMyPage);
myRouter.get(`/comments`,getMyComments);

module.exports = myRouter;