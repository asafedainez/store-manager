const joi = require('joi');
const httpStatus = require('../utils/http/status');

const validateBodySale = joi.object().keys({
  productId: joi.number().required(),
  quantity: joi.number().min(1).required(),
}).messages({
  'any.required': `${httpStatus.BAD_REQUEST}-{{#label}} is required`,
  'number.min': `${httpStatus.UNPROCESSABLE_ENTITY}-{{#label}} must be greater than or equal to 1`,
});

const validateSale = (req, _res, next) => {
  const sales = req.body;

  sales.forEach((sale) => {
    const { error } = validateBodySale.validate(sale);
    if (error) {
    const [status, message] = error.details[0].message.split('-');
    const response = { status, message };
    throw response;
  }
  });

  next();
};

module.exports = validateSale;