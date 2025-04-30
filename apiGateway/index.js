// require("dotenv").config();
// const express = require("express");
// const gatewayRoutes = require("./routes/gatewayRoutes");

// const app = express();
// // app.use(express.json());

// app.use("/", gatewayRoutes);

// const PORT = process.env.API_GATEWAY_PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`API Gateway running on port ${PORT}`);
// });
//
//
require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");

const gatewayRoutes = require("./routes/gatewayRoutes");
const rateLimiter = require("./middleWare/rateLimiter/rateLimiter"); // Rate limiter middleware
const corsMiddleware = require("./middleWare/cors/cors"); // CORS middleware

const app = express();

// CORS
app.use(corsMiddleware);

// Rate limiter
app.use(rateLimiter);

// app.use(express.json());

// Routes
app.use("/", gatewayRoutes);

// SSL certificate
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "middleWare", "ssl", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "middleWare", "ssl", "cert.pem")),
};

const PORT = process.env.API_GATEWAY_PORT || 443;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`API Gateway running securely at https://localhost:${PORT}`);
});
