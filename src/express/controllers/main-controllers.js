"use strict";

const { request } = require(`../request`);
const { HttpCode, API_URL } = require(`../../constants`);
const { userAccessToken } = require(`./utils`);
const { getNewRefreshToken } = require("../helpers/jwt-helper");
const OFFERS_LIMIT_QUANTITY_ON_PAGE = 8;

exports.getHomePage = async (req, res, next) => {
  /* if (!req.cookies.user_accessToken && req.cookies.user_refreshToken) {
    const makeNewToken = await request.post({
      url: `${API_URL}/user/refresh`,
      json: true,
      headers: {
        token: `${req.cookies.user_refreshToken}`,
      },
    });
    if (makeNewToken.statusCode === HttpCode.OK) {
      const { accessToken, refreshToken, userData } = makeNewToken.body;
      const { id, avatar } = userData;
      res
        .cookie(`user_refreshToken`, `${refreshToken}`, { maxAge: 900000000 })
        .cookie(`user_accessToken`, `${accessToken}`, { maxAge: 900000000 })
        .cookie(`user_id`, `${id}`, { maxAge: 5000 })
        .cookie(`user_avatar`, `${avatar}`, { maxAge: 900000000 });
    }
  } */

  if (!req.cookies.user_accessToken) {
    if (req.cookies.user_refreshToken) {
      const makeNewToken = await request.post({
        url: `${API_URL}/user/refresh`,
        json: true,
        headers: {
          token: `${req.cookies.user_refreshToken}`,
        },
      });
      if (makeNewToken.statusCode === HttpCode.OK) {
        const { accessToken, refreshToken, userData } = makeNewToken.body;
        const { id, avatar } = userData;
        res
          .cookie(`user_refreshToken`, `${refreshToken}`, { maxAge: 900000000 })
          .cookie(`user_accessToken`, `${accessToken}`, { maxAge: 5000 })
          .cookie(`user_id`, `${id}`, { maxAge: 900000000 })
          .cookie(`user_avatar`, `${avatar}`, { maxAge: 900000000 });
      }
    }
  }

  let offers = [],
    categories = [];

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

  
/*   res.clearCookie('user_id')
    .clearCookie('user_avatar')
    .clearCookie('user_accessToken')
    .clearCookie('user_refreshToken').render(`main`, {
      offers,
      categories,
      userData: {
        id: req.cookies.user_id,
        firstName: req.cookies.user_firstName,
        lastName: req.cookies.user_lastName,
        email: req.cookies.user_email,
        avatar: req.cookies.user_avatar
      }
    });  */
 res.render(`main`, {
    offers,
    categories,
    userData: {
      id: req.cookies.user_id,
      avatar: req.cookies.user_avatar,
    },
  }); 
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
    const {
      user_name,
      user_email,
      user_password,
      avatar,
      user_password_repeat,
    } = req.body;
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

    if (!!!userData.lastName) userData.lastName = "";

    console.log(userData);
    return res.render(`sign-up`, {
      userData: {
        name: [userData.firstName, userData.lastName],
        email: userData.email,
        avatar: userData.avatar,
      },
      errorsArr: user.body.details,
      userAlreadyExist: user.body.alreadyExists,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLoginPage = (req, res, next) => {
  try {
    res.render(`login`, {
      userData: {
        id: req.cookies.user_id,
        firstName: req.cookies.user_firstName,
        lastName: req.cookies.user_lastName,
        email: req.cookies.user_email,
        avatar: req.cookies.user_avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.postLoginPage = async (req, res, next) => {
  try {
    const { user_email, user_password } = req.body;
    const userData = {
      email: user_email,
      password: user_password,
    };

    const user = await request.post({
      url: `${API_URL}/user/login`,
      json: true,
      body: userData,
    });
    if (user.statusCode === HttpCode.OK) {
      const { accessToken, refreshToken, userData } = user.body;
      const { id, avatar } = userData;

      res
        .cookie(`user_refreshToken`, `${refreshToken}`, {
          maxAge: 124234149563,
        })
        .cookie(`user_accessToken`, `${accessToken}`, { maxAge: 5000 })
        .cookie(`user_id`, `${id}`, { maxAge: 3600000 })
        .cookie(`user_avatar`, `${avatar}`, { maxAge: 3600000 })
        .redirect("/");
    }
    return res.render("login", {
      errorsArr: user.body.details,
      userNotFound: user.body.userNotFound,
      userData: { email: userData.email },
    });
  } catch (error) {
    next(error);
  }
};

exports.getLogout = async (req, res, next) => {
  try {
    if (!req.cookies.user_accessToken && req.cookies.user_refreshToken) {
      const makeNewToken = await request.post({
        url: `${API_URL}/user/refresh`,
        json: true,
        headers: {
          token: `${req.cookies.user_refreshToken}`,
        },
      });

      if (makeNewToken.statusCode === HttpCode.OK) {
        const { accessToken, refreshToken, userData } = makeNewToken.body;
        const { id, avatar } = userData;
        res
          .cookie(`user_refreshToken`, `${refreshToken}`, { maxAge: 900000000 })
          .cookie(`user_accessToken`, `${accessToken}`, { maxAge: 5000 })
          .cookie(`user_id`, `${id}`, { maxAge: 900000000 })
          .cookie(`user_avatar`, `${avatar}`, { maxAge: 900000000 });
      }
      res.redirect("/my");
    }

    /*  if (!req.cookies.user_accessToken) {
      if (req.cookies.user_refreshToken) {
        const makeNewToken = await request.post({
          url: `${API_URL}/user/refresh`,
          json: true,
          headers: {
            token: `${req.cookies.user_refreshToken}`,
          },
        });
        if (makeNewToken.statusCode === HttpCode.OK) {
          const { accessToken, refreshToken, userData } = makeNewToken.body;
          const { id, avatar } = userData;
          res
            .cookie(`user_refreshToken`, `${refreshToken}`, { maxAge: 900000000 })
            .cookie(`user_accessToken`, `${accessToken}`, { maxAge: 5000 })
        }
        
      } else {
        return res.redirect("/login");
      }
    } */

    const user = await request.delete({
      url: `${API_URL}/user/logout`,
      json: true,
      headers: {
        Authorization: `Bearer ${req.cookies.user_accessToken}`,
      },
    });
    if (user.statusCode === HttpCode.NO_CONTENT) {
      return res
        .clearCookie("user_accessToken")
        .clearCookie("user_refreshToken")
        .clearCookie("user_id")
        .clearCookie("user_avatar")
        .redirect("/");
    } else {
      console.log(user.statusCode);
    }
  } catch (error) {
    next(error);
  }
};
