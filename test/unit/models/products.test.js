const sinon = require('sinon');
const { expect } = require('chai');

const productsModel = require('../../../models/products.models');
const connection = require('../../../utils/db/connection');

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
  describe('Busca todos produtos', () => {
    it('Retorna todos produtos cadastradas no BD', async () => {
      const connectionStub = sinon
        .stub(connection, 'execute')
        .resolves([allProducts, []]);

      const result = await productsModel.getAll();

      result.forEach((saleProduct, index) => {
        expect(saleProduct).to.contain.keys(Object.keys(allProducts[index]));
      });
      expect(result.length).to.be.eql(2);
      expect(connectionStub.calledOnce).to.be.true;

      connectionStub.restore();
    });

    it('Retorna array vazio caso não existam produtos cadastrados no BD', async () => {
      const connectionStub = sinon.stub(connection, 'execute').resolves([[]]);

      const result = await productsModel.getAll();

      expect(result).to.be.eql([]);
      expect(result.length).to.be.eql(0);
      expect(connectionStub.calledOnce).to.be.true;

      connectionStub.restore();
    });
  });

  describe('Busca produtos por id', () => {
    it('Retorna dados do produto cadastrado no BD', async () => {
      const connectionStub = sinon
        .stub(connection, 'execute')
        .resolves([[allProducts[0]]]);

      const result = await productsModel.getById(1);

      expect(result[0]).to.contain.keys(Object.keys(productC));
      expect(connectionStub.calledOnce).to.be.true;

      connectionStub.restore();
    });

    it('Retorna array vazio caso não tenha produto', async () => {
      const connectionStub = sinon.stub(connection, 'execute').resolves([[]]);

      const result = await productsModel.getById(4);

      expect(result).to.be.eql([]);
      expect(result.length).to.be.eql(0);
      expect(connectionStub.calledOnce).to.be.true;

      connectionStub.restore();
    });
  });
});

describe('Inserir produto no BD', () => {
  it('Deve retornar o id do produto', async () => {
    const connectionStub = sinon
      .stub(connection, 'execute')
      .resolves([{ insertId: 3 }]);

    const result = await productsModel.create();

    expect(result).to.be.eq(3);
    expect(connectionStub.calledOnce).to.be.true;
    connectionStub.restore();
  });
});

describe('Atualiza um produto de uma venda', () => {
  it('Deve retornar o número 1 como retorno', async () => {
    const connectionStub = sinon
      .stub(connection, 'execute')
      .resolves([{ affectedRows: 1 }]);

    const result = await productsModel.update(
      productC.id,
      productC.name,
      productC.quantity + 2
    );

    expect(result).to.be.eq(1);
    expect(connectionStub.calledOnce).to.be.true;
    connectionStub.restore();
  });
});

describe('Remove um produto do BD', () => {
  it('Deve retornar o número 1 como retorno', async () => {
    const connectionStub = sinon
      .stub(connection, 'execute')
      .resolves([{ affectedRows: 1 }]);

    const result = await productsModel.remove(productC.id);

    expect(result).to.be.eq(1);
    expect(connectionStub.calledOnce).to.be.true;
    connectionStub.restore();
  });
});
