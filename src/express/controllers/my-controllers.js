"use strict";

const { request } = require(`../request`);
const { HttpCode } = require(`../../constants`);
const { API_URL } = require(`../../constants`);
const { createPaginationPages } = require(`./utils`);
const REQUIRED_NUMBER_OF_OFFERS = 3;
const OFFERS_LIMIT_QUANTITY_ON_PAGE = 8;
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
    const {statusCode, body} = await request.get({url: `${ API_URL }/offers`, json: true});
    const offers = statusCode === HttpCode.OK ? body.offers : [];
    const userOffers = offers.slice(0, REQUIRED_NUMBER_OF_OFFERS);

    const userOffersIds = userOffers.map(({id}) => id);
    const commentRequests = userOffersIds.map((id) => request.get({
      url: `http://localhost:3000/api/offers/${ id }/comments`,
      json: true,
    }));
    const commentResponses = await Promise.all(commentRequests);
    const userComments = commentResponses.map(({statusCode: commentsStatusCode, body: commentsBody}) => commentsStatusCode === HttpCode.OK ? commentsBody : []);

    res.render(`comments`, {offers: userOffers, userComments});
  } catch (error) {
    next(error);
  }
};
