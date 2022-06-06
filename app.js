const express = require('express');
require('express-async-errors');
const error = require('./middlewares/error.middleware');
const products = require('./routes/products.routes');
const sales = require('./routes/sales.routes');

const app = express();

app.use(express.json());

app.use('/products', products);

app.use('/sales', sales);

app.get('/', (_request, response) => {
  response.send();
});

app.use(error);

module.exports = app;
