const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-project", "root", "mysql123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "127.0.0.1",
//   user: "root",
//   database: "node-project",
//   password: "mysql123",
// });

// module.exports = pool.promise();
