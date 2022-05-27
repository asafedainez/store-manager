const joi = require('joi');
const httpStatus = require('../utils/http/status');

const validateBodyProduct = joi.object().keys({
  name: joi.string().min(5).required(),
  quantity: joi.number().min(1).required(),
}).messages({
  'any.required': `${httpStatus.BAD_REQUEST}-{{#label}} is required`,
  'string.min': `${httpStatus.UNPROCESSABLE_ENTITY}-\
{{#label}} length must be at least 5 characters long`,
  'number.min': `${httpStatus.UNPROCESSABLE_ENTITY}-{{#label}} must be greater than or equal to 1`,
});

const validateProduct = (req, _res, next) => {
  const { error } = validateBodyProduct.validate(req.body);

  if (error) {
    const [status, message] = error.details[0].message.split('-');
    const response = { status, message };
    throw response;
  }

  next();
};

module.exports = validateProduct;