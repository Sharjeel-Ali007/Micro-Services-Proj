// const fs = require("fs");
// const https = require("https");

require("dotenv").config();
const cluster = require("cluster");
const os = require("os");
const path = require("path");
const express = require("express");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs - 8; i++) {
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
  //
  app.get("/sup", (req, res) => {
    res.status(200).json({ status: "API Gateway is healthy" });
  });

  const PORT = process.env.API_GATEWAY_PORT || 3000;
  app.listen(PORT, () => {
    console.log(
      `Worker ${process.pid} started: API Gateway running at http://localhost:${PORT}`
    );
  });
}
