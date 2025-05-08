const dotenv = require("dotenv");
const path = require("path");
const env = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.resolve(__dirname, `.env.${env}`),
});

module.exports = {
  jwt_secret: process.env.JWT_SECRET,
};
