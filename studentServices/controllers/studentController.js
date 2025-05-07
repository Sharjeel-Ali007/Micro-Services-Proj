const studentServices = require("../services/studentServices.js");
const gradeServices = require("../services/gradeServices.js");
const redisClient = require("../redis/redisClient");

//GET ALL
exports.getAllStudents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const cacheKey = `all_students_page_${page}_limit_${limit}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving from Redis cache");
      return res.send(JSON.parse(cachedData));
    }

    const students = await studentServices.getAll(page, limit);
    await redisClient.setEx(cacheKey, 60, JSON.stringify(students));
    res.send(students);
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).send("Server error with Redis");
  }
};

//GET BY ID

exports.getStudentById = async (req, res) => {
  try {
    const student = await studentServices.getById(req.params.id);
    if (!student) return res.status(404).send("Student not found");

    if (
      req.user.role === "student" &&
      req.user.id !== parseInt(req.params.id)
    ) {
      return res.status(403).send("Access denied");
    }

    res.send(student);
  } catch (err) {
    res.status(500).send("Error fetching student");
  }
};

//CREATE

exports.createStudent = async (req, res) => {
  const { name, age, grade, email } = req.body;
  const photo = req.file ? req.file.path.replace(/\\/g, "/") : null;
  const adminId = req.user.id;

  if (!name || !grade)
    return res.status(400).send("Name and grade are required");

  try {
    const gradeData = await gradeServices.getByName(grade);
    if (!gradeData) return res.status(400).send("Invalid grade");

    const student = await studentServices.create(
      name,
      age,
      gradeData.id,
      email,
      photo,
      adminId
    );
    await redisClient.flushAll();
    res.send(student);
  } catch (err) {
    res.status(500).send("Error creating student");
  }
};

//UPDATE

exports.updateStudent = async (req, res) => {
  const { name, email, grade, age } = req.body;
  const photo = req.file ? req.file.path.replace(/\\/g, "/") : null;

  if (!name || !email || !grade) {
    return res.status(400).send("Name, email, and grade are required");
  }

  try {
    const gradeData = await gradeServices.getByName(grade);
    if (!gradeData) return res.status(400).send("Invalid grade");

    const updatedStudent = await studentServices.update(
      req.params.id,
      name,
      email,
      age,
      gradeData.id,
      photo
    );

    if (!updatedStudent) return res.status(404).send("Student not found");

    await redisClient.flushAll();
    res.send(updatedStudent);
  } catch (err) {
    res.status(500).send("Error updating student");
  }
};

//DELETE
exports.deleteStudent = async (req, res) => {
  try {
    const result = await studentServices.delete(req.params.id);
    if (!result) return res.status(404).send("Student not found");

    await redisClient.flushAll();
    res.send("Student deleted");
  } catch (err) {
    res.status(500).send("Error deleting student");
  }
};
