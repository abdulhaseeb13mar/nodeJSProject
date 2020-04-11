const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: "shop_schema",
  password: "123456",
});

module.exports = pool.promise();
