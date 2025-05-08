require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
require("./models/adminModel");
const adminRoutes = require("./routes/adminRoutes");
const config = require("./environments/config");

const app = express();

app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Admins Service is healthy" });
});

// Admin routes
app.use("/", adminRoutes);

//SYNC DB
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced");

    // Server
    app.listen(config.port, () => {
      console.log(`Admin service running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
