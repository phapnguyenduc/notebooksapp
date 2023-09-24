const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'ducphap0112',
  database: 'notebooks',
  debug: false,
  multipleStatements: true
});

module.exports = pool;