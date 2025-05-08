require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
const gradeServices = require("./services/gradeServices");
const studentRoutes = require("./routes/studentRoutes");
const config = require("./environments/config");

const app = express();
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Student Service is healthy" });
});
app.use("/", studentRoutes);

// Sync database
sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("Database synced");

    // INSERT Default Gradess
    await gradeServices.seedInitialGrades();

    //Server
    app.listen(config.port, () => {
      console.log(`Student service running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });
