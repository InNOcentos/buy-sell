"use strict";

const Joi = require(`joi`);
const { registerMessage } = require(`../../constants`);

module.exports = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": registerMessage.EMPTY_VALUE,
  }),
  password: Joi.string().required().messages({
    "any.required": registerMessage.EMPTY_VALUE,
  }),
});
