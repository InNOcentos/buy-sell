"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);
const { userValidator, isUserExists } = require(`../middlewares`);
const { newUserSchema, userSchema } = require(`../schemas`);

const route = new Router();

module.exports = (app, userService, RefreshTokenService) => {
  const isUserExistsMiddleware = isUserExists({ service: userService });

  app.use(`/user`, route);

  route.post("/",[userValidator(newUserSchema), isUserExistsMiddleware],
    async (req, res, next) => {
      try {
        const { firstName, lastName, email, password, avatar } = req.body;

        const newUser = await userService.add({
          firstName,
          lastName,
          email,
          password,
          avatar,
        });
        res.status(HttpCode.CREATED).json(newUser);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );
};
