'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const {
  getLogger
} = require(`../logs/logger`);
const logger = getLogger();

const route = new Router();

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    logger.debug(`Start request to url /offers`);

    const offers = offerService.findAll();
    res.status(HttpCode.OK).json(offers);

    logger.info(`End request with status code ${res.statusCode}`);
  });

  route.get(`/:offerId`, (req, res) => {
    logger.debug(`Start request to url /offers${req.url}`);
    
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {

      logger.error(`End request with error ${HttpCode.NOT_FOUND}`);

      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    logger.info(`End request with status code ${HttpCode.OK}`);

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    logger.debug(`Start request to url /offers`);

    const offer = offerService.create(req.body);

    logger.info(`End request with status code ${HttpCode.CREATED}`);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, offerValidator, (req, res) => {
    logger.debug(`Start request to url /offers${req.url}`);

    const {offerId} = req.params;
    const existOffer = offerService.findOne(offerId);

    if (!existOffer) {

      logger.error(`End request with error ${HttpCode.NOT_FOUND}`);

      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    const updatedOffer = offerService.update(offerId, req.body);

    logger.info(`End request with status code ${HttpCode.OK}`);

    return res.status(HttpCode.OK)
      .json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    logger.debug(`Start request to url /offers${req.url}`);

    const {offerId} = req.params;
    const offer = offerService.drop(offerId);

    if (!offer) {

      logger.error(`End request with error ${HttpCode.NOT_FOUND}`);

      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    logger.info(`End request with status code ${HttpCode.OK}`);

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    logger.debug(`Start request to url /offers${req.url}`);

    const {offer} = res.locals;
    const comments = commentService.findAll(offer);

    logger.info(`End request with status code ${HttpCode.OK}`);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    logger.debug(`Start request to url /offers${req.url}`);

    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(offer, commentId);

    if (!deletedComment) {

      logger.error(`End request with error ${HttpCode.NOT_FOUND}`);

      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    logger.info(`End request with status code ${HttpCode.OK}`);

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    logger.debug(`Start request to url /offers${req.url}`);

    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    logger.info(`End request with status code ${HttpCode.CREATED}`);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};