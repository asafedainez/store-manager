const routes = require('express').Router();
const controller = require('../controllers/sales.controllers');

routes.get('/:id', controller.getAll);

routes.get('/', controller.getAll);

module.exports = routes;
