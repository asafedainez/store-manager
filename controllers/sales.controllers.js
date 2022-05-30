const httpStatus = require('../utils/http/status');
const service = require('../services/sales.services');

const getAll = async (req, res) => {
  const { id } = req.params;
  const response = await service.getAll(id);
  return res.status(httpStatus.OK).json(response);
};

const create = async (req, res) => {
  const products = req.body;
  const response = await service.create(products);
  return res.status(httpStatus.CREATED).json(response);
};

module.exports = {
  getAll,
  create,
};