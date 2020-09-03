'use strict';

const {HttpCode} = require(`../../constants`);
const {hasAllExpectedProperties} = require(`../../utils`);

const isRequestDataValid = ({expectedProperties}) => (req, res, next) => {
  const hasNotAllProperties = !hasAllExpectedProperties(req.body, expectedProperties);

  if (hasNotAllProperties) {
    res.status(HttpCode.BAD_REQUEST).send(`Invalid data`);

    return console.error(`Expected next properties: ${ expectedProperties }, but received: ${ Object.keys(req.body) }. End request with error: ${ res.statusCode }`);
  }

  return next();
};

exports.isRequestDataValid = isRequestDataValid;