const connection = require('../utils/db/connection');

const resultGetAllShape = (result) => ({
  saleId: result.sale_id,
  productId: result.product_id,
  quantity: result.quantity,
  id: result.id,
  date: result.date,
});

const resultGetByIdShape = (result) => ({
  date: result.date,
  productId: result.product_id,
  quantity: result.quantity,
});

const getAll = async () => {
  const [result] = await connection
    .execute(`select * 
              from sales_products as sp
              inner join sales as s
              on sp.sale_id = s.id`);
  return result.map(resultGetAllShape);
};

const getById = async (id) => {
  const [result] = await connection.execute(
    `select s.date, sp.product_id, quantity
    from sales as s
    inner join sales_products as sp
    on s.id = sp.sale_id
    where id = ?`,
    [id],
  );

  return result.map(resultGetByIdShape);
};

const createSale = async () => {
  const query = 'insert into sales (date) values (now())';
  const [result] = await connection.execute(query);
  return result.insertId;
};

const createSaleProduct = async (saleId, productId, quantity) => {
  const query = 'insert into sales_products (sale_id, product_id, quantity) values (?, ?, ?)';
  const [result] = await connection.execute(query, [saleId, productId, quantity]);
  return result.insertId;
};

const updateSaleProduct = async (saleId, productId, quantity) => {
  const query = 'update sales_products set quantity = ? where sale_id = ? and product_id = ?';
  const [result] = await connection.execute(query, [quantity, saleId, productId]);
  return result.affectedRows;
};

const removeSale = async (id) => {
  const query = 'delete from sales where id = ?';
  const [result] = await connection.execute(query, [id]);
  return result.affectedRows;
};

module.exports = {
  getAll,
  getById,
  createSale,
  createSaleProduct,
  updateSaleProduct,
  removeSale,
};