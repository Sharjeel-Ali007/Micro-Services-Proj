require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(express.json());

// Routes
app.get("/lolo", (req, res) => {
  res.send("Welcome to the Admin Service");
});
app.use("/", adminRoutes);

app.listen(process.env.ADMIN_SERVICE_PORT, () => {
  console.log(
    `Admin service running on port ${process.env.ADMIN_SERVICE_PORT}`
  );
});
