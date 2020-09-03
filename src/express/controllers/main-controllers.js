"use strict";

const { request } = require(`../request`);
const { HttpCode, API_URL } = require(`../../constants`);

const OFFERS_LIMIT_QUANTITY_ON_PAGE = 8;

exports.getHomePage = async (req, res, next) => {
  let offers;
  let categories;

  try {
    const {statusCode, body} = await request.get({
      url: `${ API_URL }/offers?limit=${ OFFERS_LIMIT_QUANTITY_ON_PAGE }`,
      json: true,
    });

    if (statusCode === HttpCode.OK) {
      offers = body.offers;
    }
  } catch (error) {
    next(error);
  }

  try {
    const {statusCode, body} = await request.get({
      url: `${ API_URL }/category`,
      json: true,
    });

    if (statusCode === HttpCode.OK) {
      categories = body;
    }
  } catch (error) {
    next(error);
  }

  res.render(`main`, {offers , categories});
};

exports.getSearch = async (req, res, next) => {
  try {
    const encodedQuery = encodeURI(req.query.search);

    const {statusCode, body} = await request.get({url: `${ API_URL }/search?query=${ encodedQuery }`, json: true});
    const results = statusCode === HttpCode.OK ? body : [];

    res.render(`search-result`, {results});
  } catch (error) {
    next(error);
  }
};
