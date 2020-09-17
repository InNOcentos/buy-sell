"use strict";

const { request } = require(`../request`);
const { HttpCode } = require(`../../constants`);
const { API_URL } = require(`../../constants`);
const { createPaginationPages } = require(`./utils`);
const REQUIRED_NUMBER_OF_OFFERS = 3;
const OFFERS_LIMIT_QUANTITY_ON_PAGE = 8;
const OFFERS_COMMENTS_LIMIT_QUANTITY_ON_PAGE = 5;
const DEFAULT_PAGE = 1;

exports.getMyPage = async (req, res, next) => {
  const {page} = req.query;
  const currentPage = page ? Number.parseInt(page, 10) : DEFAULT_PAGE;
  const offset = (currentPage - 1) * OFFERS_LIMIT_QUANTITY_ON_PAGE;

  let offers = [];
  let offersQuantity = 0;

  try {
    const {statusCode, body} = await request.get({
      url: `${ API_URL }/offers?offset=${ offset }&limit=${ OFFERS_LIMIT_QUANTITY_ON_PAGE }`,
      json: true,
    });

    if (statusCode === HttpCode.OK) {
      offers = body.offers;
      offersQuantity = body.quantity;
    }
  } catch (error) {
    return next(error);
  }

  const pagesQuantity = Math.ceil(offersQuantity / OFFERS_LIMIT_QUANTITY_ON_PAGE);
  const pages = createPaginationPages({quantity: pagesQuantity, currentPage});

  return res.render(`my-tickets`, {offers, currentPage, pages});
};

exports.getMyComments = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_URL }/offers?limit=${ OFFERS_COMMENTS_LIMIT_QUANTITY_ON_PAGE}`, json: true});
    const offers = statusCode === HttpCode.OK ? body.offers : [];

    const userOffersIds = offers.map(({id}) => id);
    const commentRequests = userOffersIds.map((id) => request.get({
      url: `http://localhost:3000/api/offers/${ id }/comments`,
      json: true,
    }));
    const commentResponses = await Promise.all(commentRequests);
    const userComments = commentResponses.map(({statusCode: commentsStatusCode, body: commentsBody}) => commentsStatusCode === HttpCode.OK ? commentsBody : []);

    res.render(`comments`, {offers: offers, userComments});
  } catch (error) {
    next(error);
  }
};

exports.postMyPage = async (req, res, next) => {
  try {
    const { offerId  } = req.body;
    const deletedOffer =  await request.delete({url: `${ API_URL }/offers/${ offerId }`, json: true});

    if (deletedOffer.statusCode === HttpCode.OK) {
      return res.redirect(`/my`);
    }
    return res.render(`errors/500`);
  } catch (error) {
    next(error);
  }
};

exports.postMyComments = async (req, res, next) => {
  try {
    const { offerId  } = req.body;
    const { commentId  } = req.body;
    const deletedComment =  await request.delete({url: `${ API_URL }/offers/${ offerId }/comments/${ commentId }`, json: true});

    if (deletedComment.statusCode === HttpCode.OK) {
      return res.redirect(`/my/comments`);
    }
    return res.render(`errors/500`);
  } catch (error) {
    next(error);
  }
};
