'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {isOfferExists,offerValidator,commentValidator, authenticateJwt, ifIsUserOfferCheck} = require('../middlewares')
const {offerSchema,commentSchema} = require(`../schemas`);
const route = new Router();

module.exports = (app, offerService, commentService, userService, logger) => {
  const isOfferExistsMiddleware = isOfferExists({service: offerService});
  const ifIsUserOfferCheckMiddleware = ifIsUserOfferCheck({service: userService});

  app.use(`/offers`, route);

  route.get('/', async (req, res, next) => {
    try {
      const {offset,limit} = req.query;
      const secondOffersSectionLimit = limit / 2;
      

      const freshOffers = await offerService.findAll({offset,limit});
      const valuableOffers = await offerService.findAllValuable({secondOffersSectionLimit});

      return res.status(HttpCode.OK).json({freshOffers,valuableOffers});
    } catch (error) {
      logger.error(`Can't get offers. Error:${error.message}`)
      next(error);
    }
  });

  route.post('/', [offerValidator(offerSchema),authenticateJwt], async (req, res, next) => {
    const {category, description, picture, title, type, sum} = req.body;
    const {id} = res.locals.user;

    try {
      const newOffer = await offerService.create({categories: category, description, picture, title, type, sum, id});

      return res.status(HttpCode.CREATED).json(newOffer);
    } catch (error) {
      logger.error(`Can't post offers. Error:${error.message}`)
      next(error);
    }
  });
  
  route.get('/my', authenticateJwt, async (req, res, next) => {
    try {
      const { id } = res.locals.user;
      const {offset, limit} = req.query;
      const result = await offerService.findAllByUser({offset, limit, id});
     
      return res.status(HttpCode.OK).json(result);
    } catch (error) {
      logger.error(`Can't get offers/my. Error:${error.message}`)
      next(error);
    }
  });

  route.get(`/:offerId`, isOfferExistsMiddleware, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const offerData= await offerService.findById(offerId);

      return res.status(HttpCode.OK).json(offerData);
    } catch (error) {
      logger.error(`Can't get offers/:id. Error:${error.message}`)
      next(error);
    }
  });

  route.put(`/:offerId`,[offerValidator(offerSchema),authenticateJwt,ifIsUserOfferCheckMiddleware], async (req, res, next) => {
    const {offerId} = req.params;
    const {category, description, picture, title, type, sum} = req.body;
    try {
      const updatedOffer = await offerService.update({id: offerId, category, description, picture, title, type, sum});

      return res.status(HttpCode.OK).json(updatedOffer);
    } catch (error) {
      logger.error(`Can't put offers/:id. Error:${error.message}`)
      next(error);
    }
  });

  route.delete(`/:offerId`,[authenticateJwt,isOfferExistsMiddleware,ifIsUserOfferCheckMiddleware], async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const deletedOffer = await offerService.delete(offerId);

      return res.status(HttpCode.OK).json(deletedOffer);
    } catch (error) {
      logger.error(`Can't delete offers/:id. Error:${error.message}`)
      next(error);
    }
  });
  route.get(`/:offerId/comments`, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const comments = await commentService.findAll(offerId);

      return res.status(HttpCode.OK).json(comments);
    } catch (error) {
      logger.error(`Can't get offers/:id/comments. Error:${error.message}`)
      next(error);
    }
  });

  route.post(`/:offerId/comments`,[commentValidator(commentSchema),authenticateJwt], async (req, res, next) => {
    const {offerId} = req.params;
    const {id: userId} = res.locals.user;
    const {comment} = req.body;

    try {
      const newComment = await commentService.create(offerId, comment, userId);

      return res.status(HttpCode.CREATED).json(newComment);
    } catch (error) {
      logger.error(`Can't post offers/:id/comments. Error:${error.message}`)
      next(error);
    }
  });

  route.delete(`/:offerId/comments/:commentId`,[authenticateJwt,ifIsUserOfferCheckMiddleware], async (req, res) => {
    const {commentId} = req.params;

    try {
      const deletedComment = await commentService.delete(commentId);

      if (!deletedComment) {
        res.status(HttpCode.NOT_FOUND).send(`Not found comment with id: ${ commentId }`);

        return console.error(`Cant find comment with id: ${ commentId }.`);
      }

      return res.status(HttpCode.OK).json(deletedComment);
    } catch (error) {
      logger.error(`Can't delete offers/:id/comments/:id. Error:${error.message}`)
      next(error);
    }
  });
};
