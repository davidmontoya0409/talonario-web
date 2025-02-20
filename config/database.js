const { Sequelize: e } = require("sequelize");
require("dotenv").config();
const sequelize = new e({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "loteria_db",
  dialect: "mysql",
  logging: !1,
});
module.exports = sequelize;
