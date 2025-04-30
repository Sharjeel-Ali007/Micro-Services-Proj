const express = require("express");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");

// router.use((req, res, next) => {
//   console.log(`API Gateway received: ${req.method} ${req.originalUrl}`);
//   next();
// });

// Proxy for admin-service
router.use(
  "/admins",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: { "^/admins": "/" },
    onError: (err, req, res) => {
      console.error(`Error proxying to admin-service: ${err.message}`);
      res.status(503).send("Admin service unavailable");
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying to admin-service: ${req.method} ${proxyReq.path}`);
    },
  })
);

// Proxy for student-service
router.use(
  "/students",
  createProxyMiddleware({
    target: "http://localhost:3002",
    pathRewrite: { "^/students": "/" },
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error(`Error proxying to student-service: ${err.message}`);
      res.status(503).send("Student service unavailable");
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying to student-service: ${req.method} ${proxyReq.path}`
      );
    },
  })
);

// Catch-all for unmatched routes
router.use((req, res) => {
  console.log(`No route found for: ${req.method} ${req.originalUrl}`);
  res.status(404).send("Route not found");
});

module.exports = router;
