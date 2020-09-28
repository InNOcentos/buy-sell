"use strict";

const Joi = require(`joi`);
const { loginMessage } = require(`./constants`);

module.exports = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email" : loginMessage.EMAIL_UNVALID,
    "any.required": loginMessage.EMPTY_VALUE,
  }),
  password: Joi.string().required().messages({
    "any.required": loginMessage.EMPTY_VALUE,
  }),
});
