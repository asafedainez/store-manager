const sinon = require('sinon');
const { expect } = require('chai');
const http_status = require('../../../utils/http/status');

const productsService = require('../../../services/products.services');
const productsModel = require('../../../models/products.models');

describe('Busca produtos no BD', () => {
  describe('Busca por todos os produtos', () => {
    const allProducts = [
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

    it('Deve retornar todos os produtos', async () => {
      const getAllStub = sinon
        .stub(productsModel, 'getAll')
        .resolves(allProducts);

      const result = await productsService.getAll();

      expect(result).to.be.eql(allProducts);
      expect(getAllStub.calledOnce).to.be.true;
      getAllStub.restore();
    });
  });

  describe('Busca produto por id', () => {
    const product = [
      {
        id: 1,
        name: 'produto A',
        quantity: 10,
      },
    ];

    it('Deve retornar produto', async () => {
      const getByIdStub = sinon
        .stub(productsModel, 'getById')
        .resolves(product);

      const result = await productsService.getAll(1);

      expect(result).to.be.equal(product[0]);
      expect(getByIdStub.calledOnce).to.be.true;
      getByIdStub.restore();
    });
  });
});
