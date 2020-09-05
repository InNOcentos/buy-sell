'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {isOfferExists} = require(`../middlewares/is-offer-exists`);
const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);

const route = new Router();

const EXPECTED_PROPERTIES = [`category`, `description`, `title`, `type`, `sum`];
const EXPECTED_PROPERTIES_COMMENTS = [`text`];

module.exports = (app, offerService, commentService) => {
  const isRequestDataValidMiddleware = isRequestDataValid({expectedProperties: EXPECTED_PROPERTIES});
  const isRequestDataValidMiddlewareComments = isRequestDataValid({expectedProperties: EXPECTED_PROPERTIES_COMMENTS});
  const isOfferExistsMiddleware = isOfferExists({service: offerService});

  app.use(`/offers`, route);

  route.get('/', async (req, res, next) => {
    try {
      const {offset, limit} = req.query;
      const result = await offerService.findAll({offset, limit});

      res.status(HttpCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  });

  route.post('/', isRequestDataValidMiddleware, async (req, res, next) => {
    const {category, description, picture, title, type, sum} = req.body;

    try {
      const newOffer = await offerService.create({categories: category, description, picture, title, type, sum});

      res.status(HttpCode.CREATED).json(newOffer);
    } catch (error) {
      next(error);
    }
  });

  route.get(`/:offerId`, isOfferExistsMiddleware, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const offer = await offerService.findById(offerId);

      res.status(HttpCode.OK).json(offer);
    } catch (error) {
      next(error);
    }
  });

  route.put(`/:offerId`, [isOfferExistsMiddleware, isRequestDataValidMiddleware], async (req, res, next) => {
    const {offerId} = req.params;
    const {category, description, picture, title, type, sum} = req.query;

    try {
      const updatedOffer = await offerService.update({id: offerId, category, description, picture, title, type, sum});

      res.status(HttpCode.OK).json(updatedOffer);
    } catch (error) {
      next(error);
    }
  });

  route.delete(`/:offerId`, isOfferExistsMiddleware, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const deletedOffer = await offerService.delete(offerId);

      res.status(HttpCode.OK).json(deletedOffer);
    } catch (error) {
      next(error);
    }
  });
  route.get(`/:offerId/comments`, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const comments = await commentService.findAll(offerId);

      res.status(HttpCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });

  route.post(`/:offerId/comments`, isRequestDataValidMiddlewareComments, async (req, res, next) => {
    const {offerId} = req.params;
    const {text} = req.body;

    try {
      const newComment = await commentService.create(offerId, text);

      res.status(HttpCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });

  route.delete(`/:offerId/comments/:commentId`, async (req, res) => {
    const {commentId} = req.params;

    try {
      const deletedComment = await commentService.delete(commentId);

      if (!deletedComment) {
        res.status(HttpCode.NOT_FOUND).send(`Not found comment with id: ${ commentId }`);

        return console.error(`Cant find comment with id: ${ commentId }.`);
      }

      return res.status(HttpCode.OK).json(deletedComment);
    } catch (error) {
      next(error);
    }
  });
};
