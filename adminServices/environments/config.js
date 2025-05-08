const dotenv = require("dotenv");
const path = require("path");
const env = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.resolve(__dirname, `.env.${env}`),
});

module.exports = {
  port: process.env.ADMIN_SERVICE_PORT,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt_secret: process.env.JWT_SECRET,
};
