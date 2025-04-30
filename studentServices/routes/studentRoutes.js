const express = require("express");
const router = express.Router();
const studentController = require("../../studentServices/controllers/studentController");
const upload = require("../../fileStorageService/upload");
const { authenticate, authorizeRole } = require("../../authServices/auth");

// Log all incoming requests
router.use((req, res, next) => {
  console.log(`Students received: ${req.method} ${req.originalUrl}`);
  next();
});
// Apply authenticate to all routes
router.use(authenticate);

router.get("/", authorizeRole("admin"), studentController.getAllStudents);

router.get("/:id", studentController.getStudentById);

router.post(
  "/",
  authorizeRole("admin"),
  upload.single("photo"),
  studentController.createStudent
);

router.put("/:id", upload.single("photo"), studentController.updateStudent);

router.delete("/:id", studentController.deleteStudent);

module.exports = router;
