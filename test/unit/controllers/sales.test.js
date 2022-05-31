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

