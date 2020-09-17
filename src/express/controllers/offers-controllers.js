"use strict";

const { request } = require(`../request`);
const { HttpCode,API_URL} = require(`../../constants`);

exports.getAddPost = async (req, res, next) => {
  try {
    const { statusCode, body: categories } = await request.get({
      url: `${API_URL}/category`,
      json: true,
    });

    if (statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`offers/new-ticket`, { categories });
  } catch (error) {
    return next(error);
  }
};

exports.postAddPost = async (req, res, next) => {
  try {
    const categoriesResult = await request.get({
      url: `${API_URL}/category`,
      json: true,
    });

    if (categoriesResult.statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    const { avatar, title, description, category, sum, type } = req.body;

    const offerCategories = Array.isArray(category) ? category : [category];

    const offer = {
      title,
      type,
      category: offerCategories,
      description,
      picture: avatar,
      sum,
    };

    const { statusCode, body } = await request.post({
      url: `${API_URL}/offers`,
      json: true,
      body: offer,
    });

    if (statusCode === HttpCode.CREATED) {
      return res.redirect(`/my`);
    }

    if (statusCode === HttpCode.UNPROCESSABLE_ENTITY) {
      const errorsArr = body;
      console.log(errorsArr);
      console.log(categoriesResult.body);
      return res.render(`offers/new-ticket`, {
        offer,
        categories: categoriesResult.body,
        errorsArr,
      });
    }

    /* TODO: настроить вывод фото и категорий при ошибке валидации формы */

    return res.render(`offers/new-ticket`, {
      categories: categoriesResult.body,
      action: `http://localhost:8080/offers/add`,
      offer,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getPostEdit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offersResult = await request.get({
      url: `${API_URL}/offers/${id}`,
      json: true,
    });

    if (offersResult.statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    const categoriesResult = await request.get({
      url: `${API_URL}/category`,
      json: true,
    });

    if (categoriesResult.statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`offers/ticket-edit`, {
      offer: offersResult.body,
      categories: categoriesResult.body,
    });
  } catch (error) {
    return next(error);
  }
};

exports.putPostEdit = async (req, res, next) => {
  try {
    const categoriesResult = await request.get({
      url: `${API_URL}/category`,
      json: true,
    });

    if (categoriesResult.statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    const { id } = req.params;
    const { avatar, title, description, category, sum, type } = req.body;

    const offerCategories = Array.isArray(category) ? category : [category];

    const offer = {
      title,
      type,
      category: offerCategories,
      description,
      picture: avatar,
      sum,
    };

    const updatedOffer = await request.put({
      url: `${API_URL}/offers/${id}`,
      json: true,
      body: offer,
    });

    if (updatedOffer.statusCode === HttpCode.OK) {
      return res.redirect(`/offers/${id}`);
    }

    if (updatedOffer.statusCode === HttpCode.INTERNAL_SERVER_ERROR) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
    }

    // if (updatedOffer.statusCode === HttpCode.UNPROCESSABLE_ENTITY) {
    //   const errorsArr = updatedOffer.body;
    //   console.log(errorsArr);
    //   console.log(categoriesResult.body);
    //   return res.render(`offers/ticket-edit`,{offer,categories: categoriesResult.body,errorsArr});
    // }

    return res.render(`offers/ticket-edit`, {
      categories: categoriesResult.body,
      offer,
      errorsArr: updatedOffer.body,
    });

    /* TODO: настроить страницу вывода конкретного предложения! */
    /* TODO: переделать - id не показывает */
  } catch (error) {
    return next(error);
  }
};

exports.get_offerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await request.get({
      url: `${API_URL}/offers/${ id }`,
      json: true,
    });

    if (offer.statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    const comments = await request.get({
      url: `${API_URL}/offers/${ id }/comments`,
      json: true,
    });

    if (comments.statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`offers/ticket`, { offer: offer.body.offer, user: offer.body.user, categories: offer.body.categoriesIds.categories, comments: comments.body});

  } catch (error) {
    return next(error);
  }
};

exports.post_commentById = async (req,res,next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const newComment = await request.post({
      url: `${API_URL}/offers/${ id }/comments`,
      json: true,
      body: {comment}
    });

    if (newComment.statusCode === HttpCode.CREATED) {
      return res.redirect(`/my/comments`);
    }

    if (newComment.statusCode === HttpCode.UNPROCESSABLE_ENTITY) {
      console.log(newComment.body)
    }

    const offer = await request.get({
      url: `${API_URL}/offers/${ id }`,
      json: true,
    });

    if (offer.statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    const comments = await request.get({
      url: `${API_URL}/offers/${ id }/comments`,
      json: true,
    });

    if (comments.statusCode === HttpCode.NOT_FOUND) {
      return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`offers/ticket`, { offer: offer.body.offer, user: offer.body.user, categories: offer.body.categoriesIds.categories, comments: comments.body, userComment: comment,errorsArr: newComment.body});
  
  } catch(error) {
    return next(error);
  }
}
