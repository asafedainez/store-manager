const sinon = require('sinon');
const { expect } = require('chai');
const http_status = require('../../../utils/http/status');

const salescontroller = require('../../../controllers/sales.controllers');
const salesservice = require('../../../services/sales.services');

describe('quando é chamada o método get deve retornar todas as vendas cadastrados', () => {
  const alldata = [
    {
      saleid: 1,
      date: '2021-09-09t04:54:29.000z',
      productid: 1,
      quantity: 2,
    },
    {
      saleid: 1,
      date: '2021-09-09t04:54:54.000z',
      productid: 2,
      quantity: 2,
    },
  ];

  const res = {};
  const req = { params: { id: null } };

  before(async () => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesservice, 'getall').resolves(alldata);
  });

  after(() => {
    salesservice.getall.restore();
  });

  it('deve retornar o status 200 - ok', async () => {
    await salescontroller.getall(req, res);
    expect(res.status.calledwith(http_status.ok)).to.be.equal(true);
  });

  it('deve retornar um array', async () => {
    await salescontroller.getall(req, res);
    expect(res.json.calledwith(sinon.match.array)).to.be.equal(true);
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

