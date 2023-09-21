const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'ducphap0112',
  database: 'notebooks',
  debug: false
});

module.exports = pool;