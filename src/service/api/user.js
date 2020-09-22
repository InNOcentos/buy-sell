"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);
const { userValidator, isUserExists, authenticate} = require(`../middlewares`);
const { newUserSchema, userSchema } = require(`../schemas`);

const route = new Router();

module.exports = (app, userService, RefreshTokenService) => {
  const isUserExistsMiddleware = isUserExists({ service: userService});
  const authenticateMiddleware = authenticate({service: userService});

  app.use('/user', route);

  route.post('/register',[userValidator(newUserSchema), isUserExistsMiddleware],
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
        
        next(error);
      }
    }
  );
  route.post('/login',[userValidator(userSchema),authenticateMiddleware], async (req,res,next) => {
    try {
      return res.status(HttpCode.OK).json('123');
    } catch (error) {
      
      next(error);
    }
  })

};
