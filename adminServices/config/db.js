const { Sequelize } = require("sequelize");
require("dotenv").config();
const config = require("../environments/config");

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: "mysql",
    logging: false,
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

module.exports = sequelize;
