'use strict';

const {HttpCode,registerMessage} = require(`../../constants`);

module.exports = ({service}) => async (req, res, next) => {
  const {email} = req.body;

  try {
    const isExists = await service.isExists(email);
    
    if (isExists) {
      res.status(HttpCode.NOT_FOUND).json({userAlreadyExist: registerMessage.EMAIL_ALREADY_EXIST});

      return console.error(`User with this email is already registerd: ${ email }.`);
    }
  } catch (error) {
    next(error);
  }

  return next();
};