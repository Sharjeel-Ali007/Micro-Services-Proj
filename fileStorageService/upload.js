const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "../fileStorageService/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});

const upload = multer({ storage });

module.exports = upload;
