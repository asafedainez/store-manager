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

const update = async (req, res) => {
  const { id } = req.params;
  const products = req.body;
  const response = await service.update(id, products);
  return res.status(httpStatus.OK).json(response);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const response = await service.remove(id);
  return res.status(httpStatus.NO_CONTENT).json(response);
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};