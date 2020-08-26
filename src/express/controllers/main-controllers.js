"use strict";

const { request } = require(`../request`);
const { HttpCode } = require(`../../constants`);

const MAX_NUMBER_OF_OFFERS = 8;

exports.getHomePage = async (req, res) => {
  const { statusCode, body } = await request.get({
    url: `http://localhost:3000/api/offers`,
    json: true,
  });
  const allOffers = statusCode === HttpCode.OK ? body : [];
  const offers = allOffers.slice(0,MAX_NUMBER_OF_OFFERS);
  res.render(`main`, { offers });
};
