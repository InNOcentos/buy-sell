"use strict";

const { request } = require(`../request`);
const { HttpCode, API_URL } = require(`../../constants`);
const { cookieStorageTime } = require('../controllers/constants')

exports.setUserCookie = (refreshToken,accessToken,id,avatar,res) => {
  return res
    .cookie(`user_refreshToken`, `${refreshToken}`, { maxAge: cookieStorageTime.refreshToken })
    .cookie(`user_accessToken`, `${accessToken}`, { maxAge: cookieStorageTime.normalStorageTime })
    .cookie(`user_id`, `${id}`, { maxAge: cookieStorageTime.normalStorageTime })
    .cookie(`user_avatar`, `${avatar}`, { maxAge: cookieStorageTime.normalStorageTime })
    .redirect("back")
};

exports.clearUserCookie = (res) => {
  return res
    .clearCookie("user_accessToken")
    .clearCookie("user_refreshToken")
    .clearCookie("user_id")
    .clearCookie("user_avatar")
    .redirect("/");
};

exports.ifUserAuthorisedCheck = async (req,res,cb1,cb2) => {
  try {
    if(!req.cookies.user_accessToken && !req.cookies.user_refreshToken) {
      cb1(res);
    }
    if (!req.cookies.user_accessToken && req.cookies.user_refreshToken) {
      const { statusCode, body } = await request.post({
        url: `${API_URL}/user/refresh`,
        json: true,
        headers: {
          token: `${req.cookies.user_refreshToken}`,
        },
      });
      if (statusCode === HttpCode.OK) {
        const { accessToken, refreshToken, userData } = body;
        const { id, avatar } = userData;
        cb2(refreshToken, accessToken, id, avatar, res);
      }
      console.log(statusCode);
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error)
  }
}

exports.getNewAccessToken = async (req,res,cb) => {
  try {
    const { statusCode, body } = await request.post({
      url: `${API_URL}/user/refresh`,
      json: true,
      headers: {
        token: `${req.cookies.user_refreshToken}`,
      },
    });
    if (statusCode === HttpCode.OK) {
      const { accessToken, refreshToken, userData } = body;
      const { id, avatar } = userData;
      cb(refreshToken, accessToken, id, avatar, res);
    }
    console.log(statusCode);
    return res.redirect("/login");
  } catch (error) {
    console.log(error)
  }
}