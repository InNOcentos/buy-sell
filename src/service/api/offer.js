'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {isOfferExists,offerValidator,commentValidator, authenticateJwt} = require('../middlewares')
const {offerSchema,commentSchema} = require(`../schemas`);
const route = new Router();

module.exports = (app, offerService, commentService) => {
  const isOfferExistsMiddleware = isOfferExists({service: offerService});

  app.use(`/offers`, route);

  route.get('/', async (req, res, next) => {
    try {
      const {limit} = req.query;
      const secondOffersSectionLimit = limit / 2;
      

      const freshOffers = await offerService.findAll({limit});
      const valuableOffers = await offerService.findAllValuable({secondOffersSectionLimit});

      return res.status(HttpCode.OK).json({freshOffers,valuableOffers});
    } catch (error) {
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
      next(error);
    }
  });

  route.get(`/:offerId`, isOfferExistsMiddleware, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const offerData= await offerService.findById(offerId);

      return res.status(HttpCode.OK).json(offerData);
    } catch (error) {
      console.log(error.message)
      next(error);
    }
  });

  route.put(`/:offerId`,[offerValidator(offerSchema),authenticateJwt], async (req, res, next) => {
    const {offerId} = req.params;
    const {category, description, picture, title, type, sum} = req.body;
    console.log({category, description, picture, title, type, sum})
    try {
      const updatedOffer = await offerService.update({id: offerId, category, description, picture, title, type, sum});

      return res.status(HttpCode.OK).json(updatedOffer);
    } catch (error) {
      next(error);
    }
  });

  route.delete(`/:offerId`,[authenticateJwt,isOfferExistsMiddleware], async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const deletedOffer = await offerService.delete(offerId);

      return res.status(HttpCode.OK).json(deletedOffer);
    } catch (error) {
      next(error);
    }
  });
  route.get(`/:offerId/comments`, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const comments = await commentService.findAll(offerId);

      return res.status(HttpCode.OK).json(comments);
    } catch (error) {
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
      next(error);
    }
  });

  route.delete(`/:offerId/comments/:commentId`,authenticateJwt, async (req, res) => {
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
