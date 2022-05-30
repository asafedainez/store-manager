const routes = require('express').Router();
const controller = require('../controllers/sales.controllers');
const middleware = require('../middlewares/sales.middleware');

routes.get('/:id', controller.getAll);

routes.get('/', controller.getAll);

routes.post('/', middleware, controller.create);

routes.put('/:id', middleware, controller.update);

routes.delete('/:id', controller.remove);

module.exports = routes;
