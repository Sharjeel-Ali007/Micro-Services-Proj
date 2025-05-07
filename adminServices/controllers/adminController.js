const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminService = require("../services/adminServices");
const redisClient = require("../redis/redisClient");
require("dotenv").config();

// Register Admin
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const photo = req.file ? req.file.path : null;

    const hashed = await bcrypt.hash(password, 10);

    const admin = await adminService.create(name, email, hashed, photo);
    await redisClient.flushAll();

    res.send({ id: admin.id, name, email });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating admin");
  }
};

//Login Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminService.findByEmail(email);
    if (!admin) return res.status(400).send("Invalid credentials");

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).send("Invalid credentials");

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// GET all Admins
exports.getAllAdmins = async (req, res) => {
  const cacheKey = "all_admins";

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Showing admins from Redis cache");
      return res.send(JSON.parse(cached));
    }

    const admins = await adminService.getAll();
    await redisClient.setEx(cacheKey, 60, JSON.stringify(admins));

    res.send(admins);
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).send("Server error with Redis");
  }
};
