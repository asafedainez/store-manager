const httpStatus = require('../utils/http/status');
const service = require('../services/products.services');

const getAll = async (req, res) => {
  const { id } = req.params;
  const response = await service.getAll(id);
  return res.status(httpStatus.OK).json(response);
};

const create = async (req, res) => {
  const { name, quantity } = req.body;
  const response = await service.create(name, quantity);
  return res.status(httpStatus.CREATED)
    .json({
      id: response,
      name,
      quantity,
    });
};

module.exports = {
  getAll,
  create,
};