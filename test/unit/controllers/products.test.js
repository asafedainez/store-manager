const sinon = require('sinon');
const { expect } = require('chai');
const http_status = require('../../../utils/http/status');

const productsController = require('../../../controllers/products.controllers');
const productsService = require('../../../services/products.services');

describe('Quando é chamada o método GET deve retornar todos os produtos cadastrados', () => {
  const allData = [
    {
      id: 1,
      name: 'produto A',
      quantity: 10,
    },
    {
      id: 2,
      name: 'produto B',
      quantity: 20,
    },
  ];

  const res = {};
  const req = { params: { id: null } };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(productsService, 'getAll').resolves(allData);
  });

  after(() => {
    productsService.getAll.restore();
  });

  it('Deve retornar o status 200', async () => {
    await productsController.getAll(req, res);
    expect(res.status.calledWith(http_status.OK)).to.be.equal(true);
  });

  it('Deve retornar um array', async () => {
    await productsController.getAll(req, res);
    expect(res.json.calledWith(sinon.match.array)).to.be.equal(true);
  });
});

});
