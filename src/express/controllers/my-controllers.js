"use strict";

const { request } = require(`../request`);
const { HttpCode } = require(`../../constants`);
const { API_URL } = require(`../../constants`);
const { createPaginationPages } = require(`./utils`);
const { userAccessToken } = require(`./utils`);
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
      } else {
        return res.redirect("/login");
      }
    }
    const {statusCode, body} = await request.get({
      url: `${ API_URL }/offers/my?offset=${ offset }&limit=${ OFFERS_LIMIT_QUANTITY_ON_PAGE }`,
      json: true,
      headers: {
        'authorization': `Bearer ${req.cookies.user_accessToken}`
      }
    });
    if (statusCode === HttpCode.OK) {
      console.log(`OK`)
      offers = body.offers;
      offersQuantity = body.quantity;
    }   
  } catch (error) {
    return next(error);
  }

  const pagesQuantity = Math.ceil(offersQuantity / OFFERS_LIMIT_QUANTITY_ON_PAGE);
  const pages = createPaginationPages({quantity: pagesQuantity, currentPage});
  console.log({offers, currentPage, pages})
  return res.render(`my-tickets`, {offers, currentPage, pages, userData: {
    id: req.cookies.user_id,
    firstName: req.cookies.user_firstName,
    lastName: req.cookies.user_lastName,
    email: req.cookies.user_email,
    avatar: req.cookies.user_avatar
  }});
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
