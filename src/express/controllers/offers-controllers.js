"use strict";

const { request } = require(`../request`);
const { HttpCode } = require(`../../constants`);

exports.getAddPost = async (req, res) => {
  const { statusCode, body } = await request.get({
    url: `http://localhost:3000/api/category`,
    json: true,
  });
  const categories = statusCode === HttpCode.OK ? body : [];

  res.render(`offers/new-ticket`, {
    categories,
    action: `http://localhost:3000/api/offers`,
  });
};

exports.getEditPost = async (req, res) => {
  const categories = await request.get({
    url: `http://localhost:3000/api/category`,
    json: true,
  });

  const { id } = req.params;
  const { statusCode, body } = await request.get({
    url: `http://localhost:3000/api/offers/${id}`,
    json: true,
  });

  if (statusCode === HttpCode.NOT_FOUND) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
  
  res.render(`offers/ticket-edit`, {offer: body, categories});
};
