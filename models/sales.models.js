const connection = require('../utils/db/connection');

const resultShape = (result) => ({
  saleId: result.sale_id,
  productId: result.product_id,
  quantity: result.quantity,
  id: result.id,
  date: result.date,
});

const getAll = async () => {
  const [result] = await connection
    .execute(`select * 
              from sales_products as sp
              inner join sales as s
              on sp.sale_id = s.id`);
  return result.map(resultShape);
};

const getById = async (id) => {
  const [result] = await connection.execute(
    'select * from sales where id = ?',
    [id],
  );

  return result;
};

module.exports = {
  getAll,
  getById,
};