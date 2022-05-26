const connection = require('../utils/db/connection');

const getAll = async () => {
  const [result] = await connection.execute('select * from sales');
  return result;
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