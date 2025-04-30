const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("../controllers/adminController.js");
const upload = require("../../fileStorageService/upload.js");
const { authenticate, authorizeRole } = require("../../authServices/auth.js");

router.post(
  "/register",
  (req, res, next) => {
    upload.single("photo")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send("File upload error");
      } else if (err) {
        return res.status(500).send("Unexpected error");
      }
      next();
    });
  },
  adminController.register
);

router.post("/login", adminController.login);

router.get(
  "/",
  authenticate,
  authorizeRole("admin"),
  adminController.getAllAdmins
);

module.exports = router;
