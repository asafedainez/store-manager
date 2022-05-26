const routes = require('express').Router();
const controller = require('../controllers/products.controllers');

routes.get('/', controller.getAll);

module.exports = routes;
