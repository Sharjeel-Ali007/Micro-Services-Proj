const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("./environments/config");

function authenticate(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied: No token provided");
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send("Invalid token");
  }
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Access denied: User not authenticated");
    }
    if (req.user.role !== role) {
      return res.status(403).send("Access denied: Insufficient rights");
    }
    next();
  };
}

module.exports = { authenticate, authorizeRole };
