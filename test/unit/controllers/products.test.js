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

  it('Deve retornar o status 200 - OK', async () => {
    await productsController.getAll(req, res);
    expect(res.status.calledWith(http_status.OK)).to.be.equal(true);
  });

  it('Deve retornar um array', async () => {
    await productsController.getAll(req, res);
    expect(res.json.calledWith(sinon.match.array)).to.be.equal(true);
  });
});

describe('Quando é chamada o método POST ', () => {
  const body = { name: 'produto', quantity: 100 };
  const responseService = { id: 1, name: 'produto', quantity: 100 };

  const res = {};
  const req = { body };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(productsService, 'create').resolves(responseService);
  });

  after(() => {
    productsService.create.restore();
  });

  it('Deve retornar o status 201 - CREATED', async () => {
    await productsController.create(req, res);
    expect(res.status.calledWith(http_status.CREATED)).to.be.equal(true);
  });

  it('Deve retornar um array', async () => {
    await productsController.create(req, res);
    expect(res.json.calledWith(sinon.match.object)).to.be.equal(true);
  });
});

describe('Quando é chamado o método PUT', () => {
  const body = { name: 'produto', quantity: 10 };
  const responseService = { id: 1, name: 'produto', quantity: 10 };

  const res = {};
  const req = { body, params: { id: 1 } };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(productsService, 'update').resolves(responseService);
  });

  after(() => {
    productsService.update.restore();
  });

  it('Deve retornar o status 200 - OK', async () => {
    await productsController.update(req, res);
    expect(res.status.calledWith(http_status.OK)).to.be.equal(true);
  });

  it('Deve retornar um array', async () => {
    await productsController.update(req, res);
    expect(res.json.calledWith(sinon.match.object)).to.be.equal(true);
  });
});

describe('Quando é chamado o método DELETE', () => {
  const res = {};
  const req = { params: { id: 1 } };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns();

    sinon.stub(productsService, 'remove').resolves([]);
  });

  after(() => {
    productsService.remove.restore();
  });

  it('Deve retornar o status 204 - NO CONTENT', async () => {
    await productsController.remove(req, res);
    expect(res.status.calledWith(http_status.NO_CONTENT)).to.be.equal(true);
  });

  it('Deve retornar nada em seu body', async () => {
    await productsController.remove(req, res);
    expect(res.json).to.be.undefined;
  });
});
