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

const haveQuantityForSales = async (products) => {
  const erro = {
    status: httpStatus.UNPROCESSABLE_ENTITY,
    message: 'Such amount is not permitted to sell',
  };

  const productsQuantityPromise = products
    .map((product) => model.getProductQuantity(product.productId));

  const productsQuantity = await Promise.all(productsQuantityPromise);

  if (productsQuantity.some((quantity, index) => quantity < products[index].quantity)) { 
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

const updateProductQuantity = async (productId, quantity) => {
  const result = await model.increaseProductQuantity(productId, quantity);
  return result;
};

const create = async (products) => {
  await haveQuantityForSales(products);
  
  const saleId = await model.createSale();

  const productsForInsert = products
    .map((product) => model.createSaleProduct(saleId, product.productId, product.quantity));
  
  await Promise.all(productsForInsert);

  const updateProducts = products
    .map((product) => updateProductQuantity(product.productId, -product.quantity));

  await Promise.all(updateProducts);

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

  const updateProducts = sale
    .map((product) => updateProductQuantity(product.productId, product.quantity));

  await Promise.all([
    model.removeSaleProduct(id),
    model.removeSale(id),
  ]);

  await Promise.all(updateProducts);
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};