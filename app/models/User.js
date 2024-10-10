const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL
    );
  `);
};

createUserTable();

module.exports = pool;