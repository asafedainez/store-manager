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

module.exports = {
  getAll,
  getById,
};
