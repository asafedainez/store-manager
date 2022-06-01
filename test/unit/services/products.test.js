const sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../../../services/products.services');
const productsModel = require('../../../models/products.models');

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
const productC = { id: 3, name: 'produto C', quantity: 30 };

describe('Busca produtos no BD', () => {
  describe('Busca por todos os produtos', () => {
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
    it('Deve retornar produto', async () => {
      const getByIdStub = sinon
        .stub(productsModel, 'getById')
        .resolves([allProducts[0]]);

      const result = await productsService.getAll(1);

      expect(result).to.be.equal(allProducts[0]);
      expect(getByIdStub.calledOnce).to.be.true;
      getByIdStub.restore();
    });
  });
});

describe('Insere novo produto no BD', () => {
  describe('Se é produto que não existe no BD', () => {
    it('Deve criar produto', async () => {
      const createStub = sinon
        .stub(productsModel, 'create')
        .resolves(productC.id);
      const getAllStub = sinon
        .stub(productsModel, 'getAll')
        .resolves(allProducts);

      const result = await productsService.create(
        productC.name,
        productC.quantity
      );

      expect(result).to.be.equal(productC.id);
      expect(getAllStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;

      createStub.restore();
      getAllStub.restore();
    });
  });

  describe('Se já existe um produto com o mesmo nome', () => {
    it('Deve retornar erro', async () => {
      const createStub = sinon.stub(productsModel, 'create').resolves();
      const getAllStub = sinon
        .stub(productsModel, 'getAll')
        .resolves(allProducts);

      try {
        await productsService.create(
          allProducts[1].name,
          allProducts[1].quantity
        );
      } catch (error) {
        expect(error.status).to.be.equal(409);
        expect(error.message).to.be.equal('Product already exists');
      }

      expect(getAllStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.false;

      createStub.restore();
      getAllStub.restore();
    });
  });
});

describe('Atualiza um produto do DB', () => {
  describe('Se o produto existir no BD', () => {
    it('Deve atualizar o produto', async () => {
      const getByIdStub = sinon
        .stub(productsModel, 'getById')
        .resolves([allProducts[1]]);
      const updateStub = sinon.stub(productsModel, 'update').resolves();

      const result = await productsService.update(
        allProducts[1].id,
        allProducts[1].name,
        allProducts[1].quantity
      );

      expect(getByIdStub.calledOnce).to.be.true;
      expect(updateStub.calledOnce).to.be.true;
      expect(result).to.be.eql(allProducts[1]);

      getByIdStub.restore();
      updateStub.restore();
    });
  });

  describe('Se o produto não existir no DB', () => {
    it('Deve retornar erro', async () => {
      const getByIdStub = sinon.stub(productsModel, 'getById').resolves([]);
      const updateStub = sinon.stub(productsModel, 'update').resolves();

      try {
        await productsService.update(
          allProducts[1].id,
          allProducts[1].name,
          allProducts[1].quantity
        );
      } catch (error) {
        expect(error.status).to.be.eql(404);
        expect(error.message).to.be.eql('Product not found');
      }

      expect(getByIdStub.calledOnce).to.be.true;
      expect(updateStub.calledOnce).to.be.false;

      getByIdStub.restore();
      updateStub.restore();
    });
  });
});

describe('Remove produto do DB', () => {
  describe('Quando existe o produto no DB', () => {
    it('Deve remover produto', async () => {
      const removeStub = sinon.stub(productsModel, 'remove').resolves([]);
      const getByIdStub = sinon
        .stub(productsModel, 'getById')
        .resolves([allProducts[0]]);

      const result = await productsService.remove(allProducts[0].id);

      expect(result).to.be.eql([]);
      expect(removeStub.calledOnce).to.be.true;
      expect(getByIdStub.calledOnce).to.be.true;

      removeStub.restore();
      getByIdStub.restore();
    });
  });

  describe('Quando não existe produto no DB', () => {
    it('Deve retornar um erro', async () => {
      const removeStub = sinon.stub(productsModel, 'remove').resolves();
      const getByIdStub = sinon.stub(productsModel, 'getById').resolves([]);

      try {
        await productsService.remove(productC.id);
      } catch (error) {
        expect(error.status).to.be.eql(404);
        expect(error.message).to.be.eql('Product not found');
      }

      expect(removeStub.calledOnce).to.be.false;
      expect(getByIdStub.calledOnce).to.be.true;

      removeStub.restore();
      getByIdStub.restore();
    });
  });
});
