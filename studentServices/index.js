require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
const gradeServices = require("./services/gradeServices");
const studentRoutes = require("./routes/studentRoutes");

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
    app.listen(process.env.STUDENT_SERVICE_PORT, () => {
      console.log(
        `Student service running on port ${process.env.STUDENT_SERVICE_PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });
