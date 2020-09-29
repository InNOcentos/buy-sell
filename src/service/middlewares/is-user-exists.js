'use strict';

const {registerMessage} = require(`../schemas/constants`);
const {HttpCode} = require(`../../constants`);
const { getLogger } = require(`../logs/logger`);
const logger = getLogger();

module.exports = ({service}) => async (req, res, next) => {
  const {email} = req.body;

  try {
    const isExists = await service.isExists(email);
    
    if (isExists) {
      logger.info(`User with this email is already registerd: ${ email }.`);
      return res.status(HttpCode.CONFLICT).json({userAlreadyExist: registerMessage.EMAIL_ALREADY_EXIST});
    }
  } catch (error) {
    logger.error(`Error: ${ error.message }.`);
    next(error);
  }

  next();
};