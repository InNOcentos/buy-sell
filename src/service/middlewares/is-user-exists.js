'use strict';

const {HttpCode,registerMessage} = require(`../../constants`);
const { getLogger } = require(`../logs/logger`);
const logger = getLogger();

module.exports = ({service}) => async (req, res, next) => {
  const {email} = req.body;

  try {
    const isExists = await service.isExists(email);
    
    if (isExists) {
      res.status(HttpCode.NOT_FOUND).json({userAlreadyExist: registerMessage.EMAIL_ALREADY_EXIST});

      return logger.info(`User with this email is already registerd: ${ email }.`);
    }
  } catch (error) {
    logger.error(`Error: ${ error.message }.`);
    next(error);
  }

  next();
};