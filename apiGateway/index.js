require("dotenv").config();
const cluster = require("cluster");
const os = require("os");
const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart the worker
    cluster.fork();
  });
} else {
  // Worker process
  const gatewayRoutes = require("./routes/gatewayRoutes");
  const rateLimiter = require("./middleWare/rateLimiter/rateLimiter");
  const corsMiddleware = require("./middleWare/cors/cors");

  const app = express();

  // CORS
  app.use(corsMiddleware);

  // Rate limiter
  app.use(rateLimiter);

  // Routes
  app.use("/", gatewayRoutes);

  // SSL certificate
  const sslCert = {
    key: fs.readFileSync(path.join(__dirname, "middleWare", "ssl", "key.pem")),
    cert: fs.readFileSync(
      path.join(__dirname, "middleWare", "ssl", "cert.pem")
    ),
  };

  const PORT = process.env.API_GATEWAY_PORT || 443;

  https.createServer(sslCert, app).listen(PORT, () => {
    console.log(
      `Worker ${process.pid} started: API Gateway running securely at https://localhost:${PORT}`
    );
  });
}
