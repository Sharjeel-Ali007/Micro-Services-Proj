require("dotenv").config();
const express = require("express");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(express.json());

// Routes
app.get("/lolo", (req, res) => {
  res.send("Welcome to the Student Service");
});
app.use("/", studentRoutes);

app.listen(process.env.STUDENT_SERVICE_PORT, () => {
  console.log(
    `Student service running on port ${process.env.STUDENT_SERVICE_PORT}`
  );
});
