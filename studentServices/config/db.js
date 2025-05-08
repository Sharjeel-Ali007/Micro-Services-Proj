const { Sequelize } = require("sequelize");
const config = require("../environments/config");

const sequelize = new Sequelize({
  host: config.db.host,
  dialect: "mysql",
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  logging: false,
});

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
