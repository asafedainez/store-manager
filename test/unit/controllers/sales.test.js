const sinon = require('sinon');
const { expect } = require('chai');
const http_status = require('../../../utils/http/status');

const salesController = require('../../../controllers/sales.controllers');
const salesService = require('../../../services/sales.services');

describe('Quando é chamada o método GET deve retornar todas as vendas cadastrados', () => {
  const allData = [
    {
      saleId: 1,
      date: '2021-09-09T04:54:29.000Z',
      productId: 1,
      quantity: 2,
    },
    {
      saleId: 1,
      date: '2021-09-09T04:54:54.000Z',
      productId: 2,
      quantity: 2,
    },
  ];

  const res = {};
  const req = { params: { id: null } };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesService, 'getAll').resolves(allData);
  });

  after(() => {
    salesService.getAll.restore();
  });

  it('Deve retornar o status 200 - OK', async () => {
    await salesController.getAll(req, res);
    expect(res.status.calledWith(http_status.OK)).to.be.equal(true);
  });

  it('Deve retornar um array', async () => {
    await salesController.getAll(req, res);
    expect(res.json.calledWith(sinon.match.array)).to.be.equal(true);
  });
});

describe('Quando é chamada o método POST ', () => {
  const body = [
    {
      productId: 1,
      quantity: 2,
    },
    {
      productId: 2,
      quantity: 5,
    },
  ];

  const responseService = {
    id: 1,
    itemsSold: [
      {
        productId: 1,
        quantity: 2,
      },
      {
        productId: 2,
        quantity: 5,
      },
    ],
  };

  const res = {};
  const req = { body };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesService, 'create').resolves(responseService);
  });

  after(() => {
    salesService.create.restore();
  });

  it('Deve retornar o status 201 - CREATED', async () => {
    await salesController.create(req, res);
    expect(res.status.calledWith(http_status.CREATED)).to.be.equal(true);
  });

  it('Deve retornar um array', async () => {
    await salesController.create(req, res);
    expect(res.json.calledWith(sinon.match.object)).to.be.equal(true);
  });
});

describe('Quando é chamado o método PUT', () => {
  const body = [
    {
      productId: 1,
      quantity: 6,
    },
  ];
  const responseService = {
    saleId: 1,
    itemUpdated: [
      {
        productId: 1,
        quantity: 6,
      },
    ],
  };

  const res = {};
  const req = { body, params: { id: 1 } };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesService, 'update').resolves(responseService);
  });

  after(() => {
    salesService.update.restore();
  });

  it('Deve retornar o status 200 - OK', async () => {
    await salesController.update(req, res);
    expect(res.status.calledWith(http_status.OK)).to.be.equal(true);
  });

  it('Deve retornar um array', async () => {
    await salesController.update(req, res);
    expect(res.json.calledWith(sinon.match.object)).to.be.equal(true);
  });
});

describe('Quando é chamado o método DELETE', () => {
  const res = {};
  const req = { params: { id: 1 } };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesService, 'remove').resolves([]);
  });

  after(() => {
    salesService.remove.restore();
  });

  it('Deve retornar o status 204 - NO CONTENT', async () => {
    await salesController.remove(req, res);
    expect(res.status.calledWith(http_status.NO_CONTENT)).to.be.equal(true);
  });
});
