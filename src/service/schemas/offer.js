"use strict";

const Joi = require(`joi`);
const { offerCreateMessage } = require(`./constants`);

module.exports = Joi.object({
  category: Joi.array()
    .items(Joi.string())
    .max(6)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          default:
            err.message = `${offerCreateMessage.EMPTY_VALUE}`;
            break;
        }
      });
      return errors;
    }),
  title: Joi.string().min(2).max(100).required().messages({
    "string.min": offerCreateMessage.MIN_TITLE_LENGTH,
    "string.max": offerCreateMessage.MAX_TITLE_LENGTH,
    "any.required": offerCreateMessage.EMPTY_VALUE,
  }),
  picture: Joi.string().required().messages({
    "any.required": offerCreateMessage.EMPTY_PICTURE_VALUE,
  }),
  sum: Joi.number().min(1).max(1000000).required().messages({
    "number.min": offerCreateMessage.MIN_SUM_COUNT,
    "number.max": offerCreateMessage.MAX_SUM_COUNT,
    "any.required": offerCreateMessage.EMPTY_VALUE,
  }),
  type: Joi.string().valid("buy", "sell").required().messages({
    "any.required": offerCreateMessage.EMPTY_TYPE_VALUE,
  }),
  description: Joi.string().min(10).max(1000).messages({
    "string.min": offerCreateMessage.MIN_DESCRIPTION_LENGTH,
    "string.max": offerCreateMessage.MAX_DESCRIPTION_LENGTH,
    "any.required": offerCreateMessage.EMPTY_VALUE,
  }),
});
