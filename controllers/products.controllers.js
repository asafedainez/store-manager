const httpStatus = require('../utils/http/status');
const service = require('../services/products.services');

const getAll = async (req, res) => {
  const { id } = req.params;
  const response = await service.getAll(id);
  return res.status(httpStatus.OK).json(response);
};

module.exports = {
  getAll,
};