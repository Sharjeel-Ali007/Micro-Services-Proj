const express = require("express");
const router = express.Router();
const multer = require("multer");
const studentController = require("../controllers/studentController");
const upload = require("../../fileStorageService/upload");
const { authenticate, authorizeRole } = require("../../authServices/auth");

router.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  upload.single("photo"),
  studentController.createStudent
);

router.get("/", authenticate, studentController.getAllStudents);

router.get("/:id", authenticate, studentController.getStudentById);

router.put(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  upload.single("photo"),
  studentController.updateStudent
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  studentController.deleteStudent
);

module.exports = router;
