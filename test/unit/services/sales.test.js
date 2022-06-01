const sinon = require('sinon');
const { expect } = require('chai');

const salesService = require('../../../services/sales.services');
const salesModel = require('../../../models/sales.models');

const allSales = [
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

const saleById = [
  {
    date: '2021-09-09T04:54:29.000Z',
    productId: 1,
    quantity: 2,
  },
  {
    date: '2021-09-09T04:54:54.000Z',
    productId: 2,
    quantity: 2,
  },
];

const products = [
  {
    productId: 1,
    quantity: 2,
  },
  {
    productId: 2,
    quantity: 5,
  },
];

describe('Busca vendas no BD', () => {
  describe('Busca por todas as vendas', () => {
    it('Deve retornar todas as vendas', async () => {
      const getAllStub = sinon.stub(salesModel, 'getAll').resolves(allSales);

      const result = await salesService.getAll();

      expect(result).to.be.eql(allSales);
      expect(getAllStub.calledOnce).to.be.true;
      getAllStub.restore();
    });
  });

  describe('Busca venda por id', () => {
    it('Deve retornar os produtos da venda', async () => {
      const getByIdStub = sinon.stub(salesModel, 'getById').resolves(saleById);

      const result = await salesService.getAll(1);

      expect(result).to.be.equal(saleById);
      expect(getByIdStub.calledOnce).to.be.true;
      getByIdStub.restore();
    });
  });
});

describe('Insere nova venda no BD', () => {
  describe('Se tem a quantidade de produtos no BD', () => {
    it('Deve criar uma nova venda', async () => {
      const createSaleStub = sinon.stub(salesModel, 'createSale').resolves(1);
      const createSaleProductStub = sinon
        .stub(salesModel, 'createSaleProduct')
        .resolves();
      const getProductQuantityStub = sinon
        .stub(salesModel, 'getProductQuantity')
        .resolves(100);
      const increaseProductQuantityStub = sinon.stub(
        salesModel,
        'increaseProductQuantity'
      );

      const result = await salesService.create(products);

      expect(result).to.have.keys(['id', 'itemsSold']);
      expect(createSaleStub.calledOnce).to.be.true;
      expect(createSaleProductStub.called).to.be.true;
      expect(getProductQuantityStub.called).to.be.true;
      expect(increaseProductQuantityStub.called).to.be.true;

      createSaleStub.restore();
      createSaleProductStub.restore();
      getProductQuantityStub.restore();
      increaseProductQuantityStub.restore();
    });
  });

  describe('Se retorna um erro quando a quantidade de produtos na venda for maior que a quantidade no BD', () => {
    it('Deve retornar erro', async () => {
      const createSaleStub = sinon.stub(salesModel, 'createSale').resolves(1);
      const createSaleProductStub = sinon
        .stub(salesModel, 'createSaleProduct')
        .resolves();
      const getProductQuantityStub = sinon
        .stub(salesModel, 'getProductQuantity')
        .resolves(1);
      const increaseProductQuantityStub = sinon.stub(
        salesModel,
        'increaseProductQuantity'
      );

      try {
        await salesService.create(products);
      } catch (error) {
        expect(error.status).to.be.equal(422);
        expect(error.message).to.be.equal(
          'Such amount is not permitted to sell'
        );
      }

      expect(createSaleStub.calledOnce).to.be.false;
      expect(createSaleProductStub.calledOnce).to.be.false;
      expect(getProductQuantityStub.called).to.be.true;
      expect(increaseProductQuantityStub.calledOnce).to.be.false;

      createSaleStub.restore();
      createSaleProductStub.restore();
      getProductQuantityStub.restore();
      increaseProductQuantityStub.restore();
    });
  });
});

describe('Atualiza um produto da venda do DB', () => {
  describe('Se a venda existir no BD', () => {
    it('Deve atualizar o produto', async () => {
      const getByIdStub = sinon.stub(salesModel, 'getById').resolves(allSales);
      const updateSaleProductStub = sinon
        .stub(salesModel, 'updateSaleProduct')
        .resolves();

      const result = await salesService.update(1, products);

      expect(getByIdStub.calledOnce).to.be.true;
      expect(updateSaleProductStub.called).to.be.true;
      expect(result).to.have.keys('saleId', 'itemUpdated');

      getByIdStub.restore();
      updateSaleProductStub.restore();
    });
  });

  describe('Se a venda não existir no DB', () => {
    it('Deve retornar erro', async () => {
      const getByIdStub = sinon.stub(salesModel, 'getById').resolves([]);
      const updateSaleProductStub = sinon
        .stub(salesModel, 'updateSaleProduct')
        .resolves();

      try {
        await salesService.update(1, products);
      } catch (error) {
        expect(error.status).to.be.eql(404);
        expect(error.message).to.be.eql('Sale not found');
      }

      expect(getByIdStub.calledOnce).to.be.true;
      expect(updateSaleProductStub.called).to.be.false;

      getByIdStub.restore();
      updateSaleProductStub.restore();
    });
  });
});

describe('Remove venda do DB', () => {
  describe('Quando existe a venda no DB', () => {
    it('Deve remover venda', async () => {
      const removeSaleStub = sinon.stub(salesModel, 'removeSale').resolves();
      const removeSaleProductStub = sinon
        .stub(salesModel, 'removeSaleProduct')
        .resolves();
      const getByIdStub = sinon.stub(salesModel, 'getById').resolves(allSales);
      const increaseProductQuantityStub = sinon
        .stub(salesModel, 'increaseProductQuantity')
        .resolves();

      await salesService.remove(1);

      expect(removeSaleStub.calledOnce).to.be.true;
      expect(removeSaleProductStub.calledOnce).to.be.true;
      expect(getByIdStub.calledOnce).to.be.true;
      expect(increaseProductQuantityStub.called).to.be.true;

      getByIdStub.restore();
      removeSaleStub.restore();
      removeSaleProductStub.restore();
      increaseProductQuantityStub.restore();
    });
  });

  describe('Quando não existe venda no DB', () => {
    it('Deve retornar um erro', async () => {
      const removeSaleStub = sinon.stub(salesModel, 'removeSale').resolves();
      const removeSaleProductStub = sinon
        .stub(salesModel, 'removeSaleProduct')
        .resolves();
      const getByIdStub = sinon.stub(salesModel, 'getById').resolves([]);
      const increaseProductQuantityStub = sinon
        .stub(salesModel, 'increaseProductQuantity')
        .resolves();

      try {
        await salesService.remove(5);
      } catch (error) {
        expect(error.status).to.be.eql(404);
        expect(error.message).to.be.eql('Sale not found');
      }

      expect(getByIdStub.calledOnce).to.be.true;
      expect(removeSaleStub.calledOnce).to.be.false;
      expect(removeSaleProductStub.calledOnce).to.be.false;
      expect(increaseProductQuantityStub.calledOnce).to.be.false;

      getByIdStub.restore();
      removeSaleStub.restore();
      removeSaleProductStub.restore();
      increaseProductQuantityStub.restore();
    });
  });
});
