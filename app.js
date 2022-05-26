const express = require('express');
require('express-async-errors');
const error = require('./middlewares/error.middleware');
const products = require('./routes/products.routes');

const app = express();

app.use(express.json());

app.use('/products', products);

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use(error);

// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação
module.exports = app;
