"use strict";

const { request } = require(`../request`);
const { HttpCode, API_URL } = require(`../../constants`);

const OFFERS_LIMIT_QUANTITY_ON_PAGE = 8;

exports.getHomePage = async (req, res, next) => {
  let offers;
  let categories;

  try {
    const { statusCode, body } = await request.get({
      url: `${API_URL}/offers?limit=${OFFERS_LIMIT_QUANTITY_ON_PAGE}`,
      json: true,
    });

    if (statusCode === HttpCode.OK) {
      offers = body.offers;
    }
  } catch (error) {
    next(error);
  }

  try {
    const { statusCode, body } = await request.get({
      url: `${API_URL}/category`,
      json: true,
    });

    if (statusCode === HttpCode.OK) {
      categories = body;
    }
  } catch (error) {
    next(error);
  }

  res.render(`main`, { offers, categories });
};

exports.getSearch = async (req, res, next) => {
  if (req.query.search) {
    try {
      const encodedQuery = encodeURI(req.query.search);

      const { statusCode, body } = await request.get({
        url: `${API_URL}/search?query=${encodedQuery}`,
        json: true,
      });
      const results = statusCode === HttpCode.OK ? body : [];

      res.render(`search-result`, { results });
    } catch (error) {
      next(error);
    }
  }

  if (req.query.category) {
    try {
      const categoryId = req.query.category;

      const { statusCode, body } = await request.get({
        url: `${API_URL}/search/${categoryId}`,
        json: true,
      });
      const results = statusCode === HttpCode.OK ? body : [];

      res.render(`search-result`, { results });
    } catch (error) {
      next(error);
    }
  }
};

exports.get_signUpPage = async (req, res, next) => {
  try {
    res.render(`sign-up`);
  } catch (error) {
    next(error);
  }
};

exports.post_signUpPage = async (req, res, next) => {
  try {
    const { user_name, user_email, user_password, avatar, user_password_repeat } = req.body;
    const userFullName = user_name.split(` `) || [userFullName];

    const userData = {
      firstName: userFullName[0],
      lastName: userFullName[1],
      email: user_email,
      password: user_password,
      avatar: avatar,
      repeat: user_password_repeat,
    };

    const user = await request.post({
      url: `${API_URL}/user/register`,
      json: true,
      body: userData,
    });

    if (user.statusCode === HttpCode.CREATED) {
      return res.redirect(`/login`);
    }

    if (!!!userData.lastName) userData.lastName = '';

    console.log(userData);
    return res.render(`sign-up`,{userData: {name: [userData.firstName,userData.lastName],email: userData.email, avatar: userData.avatar},errorsArr: user.body.details, userAlreadyExist: user.body.alreadyExists});

  } catch (error) {
    next(error);
  }
};

exports.getLoginPage = (req,res,next) => {
  try {
    res.render(`login`);
  } catch (error) {
    next(error);
  }
}

exports.postLoginPage = async (req,res,next) => {
  try {

    const {user_email, user_password} = req.body;
    const userData = {
      email: user_email,
      password: user_password
    }

    const user = await request.post({
      url: `${API_URL}/user/login`,
      json: true,
      body: userData,
    });
    if (user.statusCode === HttpCode.OK) return res.redirect(`/`);

    return res.render('login',{errorsArr: user.body.details, userNotFound: user.body.userNotFound, userData: {email:userData.email}})

  } catch (error) {
    next(error);
  }
}
