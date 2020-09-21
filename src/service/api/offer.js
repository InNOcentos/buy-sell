'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {isOfferExists,offerValidator,commentValidator} = require('../middlewares')
const {offerSchema,commentSchema} = require(`../schemas`);
const route = new Router();

module.exports = (app, offerService, commentService) => {
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

  route.post('/', offerValidator(offerSchema), async (req, res, next) => {
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
      const offerData= await offerService.findById(offerId);

      res.status(HttpCode.OK).json(offerData);
    } catch (error) {
      console.log(error.message)
      next(error);
    }
  });

  route.put(`/:offerId`, offerValidator(offerSchema), async (req, res, next) => {
    const {offerId} = req.params;
    const {category, description, picture, title, type, sum} = req.body;
    console.log({category, description, picture, title, type, sum})
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

  route.post(`/:offerId/comments`,commentValidator(commentSchema), async (req, res, next) => {
    const {offerId} = req.params;
    const {comment} = req.body;

    try {
      const newComment = await commentService.create(offerId, comment);

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
