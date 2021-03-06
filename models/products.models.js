const connection = require('../utils/db/connection');

const getAll = async () => {
  const [result] = await connection.execute('select * from products');
  return result;
};

const getById = async (id) => {
  const [result] = await connection.execute(
    'select * from products where id = ?',
    [id],
  );

  return result;
};

const create = async (name, quantity) => {
  const query = 'insert into products (name, quantity) values (?, ?)';
  const [result] = await connection.execute(query, [name, quantity]);
  return result.insertId;
};

const update = async (id, name, quantity) => {
  const query = 'update products set name = ?, quantity = ? where id = ?';
  const [result] = await connection.execute(query, [name, quantity, id]);
  return result.affectedRows;
};

const remove = async (id) => {
  const query = 'delete from products where id = ?';
  const [result] = await connection.execute(query, [id]);
  return result.affectedRows;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};