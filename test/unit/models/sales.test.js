const sinon = require('sinon');
const { expect } = require('chai');

const salesModel = require('../../../models/sales.models');
const connection = require('../../../utils/db/connection');

const connectionExecuteReturn = [
  {
    sale_id: 1,
    date: '2021-09-09T04:54:29.000Z',
    product_id: 1,
    quantity: 2,
  },
  {
    sale_id: 1,
    date: '2021-09-09T04:54:54.000Z',
    product_id: 2,
    quantity: 2,
  },
  {
    sale_id: 2,
    date: '2021-09-21T08:30:05.000Z',
    product_id: 3,
    quantity: 5,
  },
];

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
  {
    saleId: 2,
    date: '2021-09-21T08:30:05.000Z',
    productId: 3,
    quantity: 5,
  },
];

const productA = {
  id: 1,
  name: 'produto A',
  quantity: 10,
};

describe('Busca vendas no BD', () => {
  describe('Busca todas as vendas', () => {
    it('Retorna todas as vendas cadastradas no BD', async () => {
      const connectionStub = sinon
        .stub(connection, 'execute')
        .resolves([connectionExecuteReturn, []]);

      const result = await salesModel.getAll();

      result.forEach((saleProduct, index) => {
        expect(saleProduct).to.contain.keys(Object.keys(allSales[index]));
      });
      expect(result.length).to.be.eql(3);
      expect(connectionStub.calledOnce).to.be.true;

      connectionStub.restore();
    });

    it('Retorna array vazio caso não exista vendas cadastradas no BD', async () => {
      const connectionStub = sinon.stub(connection, 'execute').resolves([[]]);

      const result = await salesModel.getAll();

      expect(result).to.be.eql([]);
      expect(result.length).to.be.eql(0);
      expect(connectionStub.calledOnce).to.be.true;

      connectionStub.restore();
    });
  });

  describe('Busca venda por id', () => {
    it('Retorna dados da venda cadastrada no BD', async () => {
      const connectionStub = sinon
        .stub(connection, 'execute')
        .resolves([[connectionExecuteReturn[2]]]);

      const result = await salesModel.getById(2);

      expect(result[0]).to.contain.keys(['date', 'productId', 'quantity']);
      expect(connectionStub.calledOnce).to.be.true;

      connectionStub.restore();
    });

    it('Retorna array vazio caso não tenha venda', async () => {
      const connectionStub = sinon.stub(connection, 'execute').resolves([[]]);

      const result = await salesModel.getById(4);

      expect(result).to.be.eql([]);
      expect(result.length).to.be.eql(0);
      expect(connectionStub.calledOnce).to.be.true;

      connectionStub.restore();
    });
  });
});

describe('Inserir venda completa no BD', () => {
  describe('Inserir venda', () => {
    it('Deve retornar o id da venda', async () => {
      const connectionStub = sinon
        .stub(connection, 'execute')
        .resolves([{ insertId: 1 }]);

      const result = await salesModel.createSale();

      expect(result).to.be.eq(1);
      expect(connectionStub.calledOnce).to.be.true;
      connectionStub.restore();
    });
  });

  describe('Inserir produto da venda', () => {
    it('Deve retornar o id do produto retorno', async () => {
      const connectionStub = sinon
        .stub(connection, 'execute')
        .resolves([{ insertId: 1 }]);

      const result = await salesModel.createSaleProduct(
        1,
        productA.id,
        productA.quantity
      );

      expect(result).to.be.eq(1);
      expect(connectionStub.calledOnce).to.be.true;
      connectionStub.restore();
    });
  });
});

describe('Atualiza um produto de uma venda', () => {
  it('Deve retornar o número 1 como retorno', async () => {
    const connectionStub = sinon
      .stub(connection, 'execute')
      .resolves([{ affectedRows: 1 }]);

    const result = await salesModel.updateSaleProduct(
      1,
      productA.id,
      productA.quantity + 2
    );

    expect(result).to.be.eq(1);
    expect(connectionStub.calledOnce).to.be.true;
    connectionStub.restore();
  });
});

describe('Incrementa a quantidade de produtos no BD', () => {
  it('Deve retornar o número 1 como retorno', async () => {
    const connectionStub = sinon
      .stub(connection, 'execute')
      .resolves([{ affectedRows: 1 }]);

    const result = await salesModel.increaseProductQuantity(
      productA.id,
      productA.quantity + 6
    );

    expect(result).to.be.eq(1);
    expect(connectionStub.calledOnce).to.be.true;
    connectionStub.restore();
  });
});

describe('Remove uma venda do BD', () => {
  describe('Remove os produtos da venda', () => {
    it('Deve retornar o número 1 como retorno', async () => {
      const connectionStub = sinon
        .stub(connection, 'execute')
        .resolves([{ affectedRows: 1 }]);

      const result = await salesModel.removeSaleProduct(productA.id);

      expect(result).to.be.eq(1);
      expect(connectionStub.calledOnce).to.be.true;
      connectionStub.restore();
    });
  });
  describe('Remove a venda', () => {
    it('Deve retornar o número 1 como retorno', async () => {
      const connectionStub = sinon
        .stub(connection, 'execute')
        .resolves([{ affectedRows: 1 }]);

      const result = await salesModel.removeSale(productA.id);

      expect(result).to.be.eq(1);
      expect(connectionStub.calledOnce).to.be.true;
      connectionStub.restore();
    });
  });
});

describe('Consulta quantidade de produtos no BD', () => {
  it('Deve retornar a quantidade', async () => {
    const connectionStub = sinon
      .stub(connection, 'execute')
      .resolves([[productA]]);

    const result = await salesModel.getProductQuantity(productA.id);

    expect(result).to.be.eq(productA.quantity);
    expect(connectionStub.calledOnce).to.be.true;
    connectionStub.restore();
  });
});
