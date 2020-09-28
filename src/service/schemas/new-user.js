"use strict";

const Joi = require(`joi`);
const { registerMessage } = require(`./constants`);

module.exports = Joi.object({
  firstName: Joi.string().min(1).max(50).required().messages({
    "string.max": registerMessage.MAX_FRISTNAME_LENGTH,
    "any.required": registerMessage.EMPTY_FIRSTNAME_VALUE,
  }),
  lastName: Joi.string().min(1).max(50).required().messages({
    "string.max": registerMessage.MAX_LASTNAME_LENGTH,
    "any.required": registerMessage.EMPTY_SECONDNAME_VALUE,
    "string.empty": registerMessage.EMPTY_SECONDNAME_VALUE,
  }),
  email: Joi.string().email().required().messages({
    "string.email" : registerMessage.EMAIL_UNVALID,
    "any.required": registerMessage.EMPTY_VALUE,
  }),
  password: Joi.string().min(6).max(12).required().messages({
    "string.min": registerMessage.MIN_PASSWORD_LENGTH,
    "string.max": registerMessage.MAX_PASSWORD_LENGTH,
    "any.required": registerMessage.EMPTY_VALUE,
  }),
  avatar: Joi.string().required().messages({
    "any.required": registerMessage.EMPTY_VALUE,
  }),
  repeat: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": registerMessage.PASSWORDS_NOT_EQUALS,
    "any.required": registerMessage.EMPTY_VALUE,
  }),
});
