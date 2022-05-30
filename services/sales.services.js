const model = require('../models/sales.models');
const httpStatus = require('../utils/http/status');

const isResponseEmpty = (response) => {
  const erro = { 
    status: httpStatus.NOT_FOUND,
    message: 'Sale not found',
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

const create = async (products) => {
  const saleId = await model.createSale();

  const productsForInsert = products
    .map((product) => model.createSaleProduct(saleId, product.productId, product.quantity));
  
  await Promise.all(productsForInsert);

  return { id: saleId, itemsSold: products };
};

const update = async (id, products) => {
  const sale = await model.getById(id);
  isResponseEmpty(sale);

  const productsForUpdate = products
    .map((product) => model.updateSaleProduct(id, product.productId, product.quantity));

  await Promise.all(productsForUpdate);

  return { saleId: id, itemUpdated: products };
};

const remove = async (id) => {
  const sale = await model.getById(id);
  isResponseEmpty(sale);

  await Promise.all([
    model.removeSaleProduct(id),
    model.removeSale(id),
  ]);
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};