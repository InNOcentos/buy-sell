"use strict";

const Joi = require(`joi`);
const { offerCreateMessage } = require(`./constants`);

module.exports = Joi.object({
  comment: Joi.string().min(10).max(300).required().messages({
    "string.min": offerCreateMessage.MIN_COMMENT_LENGTH,
    "string.max": offerCreateMessage.MAX_COMMENT_LENGTH,
    "any.required": offerCreateMessage.EMPTY_VALUE,
  })
});
