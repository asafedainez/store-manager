const routes = require('express').Router();
const controller = require('../controllers/products.controllers');
const middleware = require('../middlewares/products.middleware');

routes.get('/:id', controller.getAll);

routes.get('/', controller.getAll);

routes.post('/', middleware, (_req, _res) => {});

routes.put('/:id', middleware, (_req, _res) => {});

module.exports = routes;
