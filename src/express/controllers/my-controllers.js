"use strict";

const { request } = require(`../request`);
const { HttpCode } = require(`../../constants`);

const REQUIRED_NUMBER_OF_OFFERS = 3;

exports.getMyPage = async (req, res) => {
  const { statusCode, body } = await request.get({
    url: `http://localhost:3000/api/offers`,
    json: true,
  });
  const offers = statusCode === HttpCode.OK ? body : [];

  res.render(`my-tickets`, { offers });
};

exports.getMyComments = async (req, res) => {
  const { statusCode, body } = await request.get({
    url: `http://localhost:3000/api/offers`,
    json: true,
  });
  const offers = statusCode === HttpCode.OK ? body : [];
  const userOffers = offers.slice(0, REQUIRED_NUMBER_OF_OFFERS);

  const userOffersIds = userOffers.map(({ id }) => id);
  const commentRequests = userOffersIds.map((id) =>
    request.get({
      url: `http://localhost:3000/api/offers/${id}/comments`,
      json: true,
    })
  );
  const commentResponses = await Promise.all(commentRequests);
  const userComments = commentResponses.map(({ statusCode, body }) =>
    statusCode === HttpCode.OK ? body : []
  );

  res.render(`comments`, { offers: userOffers, comments: userComments });
};
