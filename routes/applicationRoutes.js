
const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const {applyForInternship} = require('../controllers/applicationController.js')

const router = express.Router();

// File upload setup
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/apply", upload.single("resume"), applyForInternship);

module.exports = router