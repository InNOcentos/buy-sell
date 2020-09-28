"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);
const { userValidator, isUserExists, authenticate, authenticateJwt} = require(`../middlewares`);
const { newUserSchema, userSchema } = require(`../schemas`);
const { makeTokens } = require(`../helpers/jwt-helper`);
const jwt = require(`jsonwebtoken`);
const {jwt_refresh_secret} = require(`../../config`);

const route = new Router();

module.exports = (app, userService, RefreshTokenService,logger) => {
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
        return res.status(HttpCode.CREATED).json(newUser);
      } catch (error) {
        logger.error(`Can't post user/register. Error:${error.message}`)
        next(error);
      }
    }
  );
  
  route.post('/login',[userValidator(userSchema),authenticateMiddleware], async (req,res,next) => {
    try {

      const {id,avatar} = res.locals.user;
      const {accessToken, refreshToken}  = makeTokens({id,avatar});

      await RefreshTokenService.add(refreshToken);

      return res
        .status(HttpCode.OK)
        .json({accessToken,refreshToken,userData: {id,avatar}})
    } catch (error) {
      logger.error(`Can't post user/login. Error:${error.message}`)
      next(error);
    }
  });
  
  route.post(`/refresh`, async (req, res, next) => {
    try {
      const token = req.headers['token'];
      
      if (!token) {
          return res.sendStatus(HttpCode.BAD_REQUEST);
      };
  
      const existToken = await RefreshTokenService.find(token);
      
      if (!existToken) {
          return res.sendStatus(HttpCode.NOT_FOUND);
      }
  
      jwt.verify(token, jwt_refresh_secret, async (err, userData) => {
          if (err) {
            
              return res.sendStatus(HttpCode.FORBIDDEN);
          }
          
          const {id,avatar} = userData;
          const {accessToken, refreshToken}  = makeTokens({id,avatar});
  
          await RefreshTokenService.drop(existToken);
          await RefreshTokenService.add(refreshToken);
  
          return res.status(HttpCode.OK).json({accessToken, refreshToken,userData: {id,avatar}});
      });
    } catch (error) {
      logger.error(`Can't post user/refresh. Error:${error.message}`)
      next(error);
    }
    
  });

  route.delete(`/logout`, authenticateJwt, (req, res, next) => {
    try {
      const token = res.locals.userToken;
      RefreshTokenService.drop(token);
      return res.sendStatus(HttpCode.NO_CONTENT);
    } catch (error) {
      logger.error(`Can't delete user/logout. Error:${error.message}`)
      next(error);
    }
      
  })

  route.get(`/check`, authenticateJwt, async (req, res, next) => {
    try {
      const {id: user_id} = res.locals.user;
      const offer_id = req.query.q;

      const haveRights = await userService.checkRights(user_id,offer_id);

      return res.status(HttpCode.OK).json(haveRights);
    } catch (error) {
      logger.error(`Can't get user/check. Error:${error.message}`)
      next(error);
    }
      
  })

};
