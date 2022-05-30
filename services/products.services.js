const model = require('../models/products.models');
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

const hasNameInBD = (name, bd) => {
  const isUnique = bd.some((row) => row.name === name);
  return isUnique;
};

const getAll = async (id = null) => {
  if (id) {
    const response = await model.getById(id);
    isResponseEmpty(response);
    return response[0];
  }
  const response = await model.getAll();
  return response;
};

const create = async (name, quantity) => {
  const erro = { 
    status: httpStatus.CONFLICT,
    message: 'Product already exists',
  };

  const products = await getAll();

  if (hasNameInBD(name, products)) {
    throw erro;
  }

  const response = await model.create(name, quantity);
  console.log(response);
  return response;
};

module.exports = {
  getAll,
  create,
};