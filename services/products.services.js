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
  const erro = { 
    status: httpStatus.CONFLICT,
    message: 'Product already exists',
  };

  const isUnique = bd.some((row) => row.name === name);
  
  if (isUnique) {
    throw erro;
  }
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
  const products = await getAll();

  hasNameInBD(name, products);

  const response = await model.create(name, quantity);
  return response;
};

const update = async (id, name, quantity) => {
  const productById = await model.getById(id);
  isResponseEmpty(productById);

  await model.update(id, name, quantity);
  return { id, name, quantity };
};

module.exports = {
  getAll,
  create,
  update,
};