const model = require('../models/products.models');

const getAll = async (id = null) => {
  if (id) {
    const response = await model.getById(id);
    return response;
  }
  const response = await model.getAll();
  return response;
};

module.exports = {
  getAll,
};