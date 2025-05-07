// require("dotenv").config();
// const express = require("express");
// const sequelize = require("./config/database");
// require("./models/Admin");
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();
// app.use(express.json());

// // Routes
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "Admins Service is healthy" });
// });

// app.use("/", adminRoutes);

// app.listen(process.env.ADMIN_SERVICE_PORT, () => {
//   console.log(
//     `Admin service running on port ${process.env.ADMIN_SERVICE_PORT}`
//   );
// });
//

require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
require("./models/adminModel");
const adminRoutes = require("./routes/adminRoutes");

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
    app.listen(process.env.ADMIN_SERVICE_PORT, () => {
      console.log(
        `Admin service running on port ${process.env.ADMIN_SERVICE_PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
