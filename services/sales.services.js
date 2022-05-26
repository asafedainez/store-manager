const model = require('../models/sales.models');
const httpStatus = require('../utils/http/status');

const isResponseEmpty = (response) => {
  const erro = { 
    status: httpStatus.NOT_FOUND,
    message: 'Product not found',
  };

  if (!response.length) {
    throw erro;
  }
};

const getAll = async (id = null) => {
  if (id) {
    const response = await model.getById(id);
    isResponseEmpty(response);
    return response;
  }
  const response = await model.getAll();
  return response;
};

module.exports = {
  getAll,
};