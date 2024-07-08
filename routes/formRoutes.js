// routes/formRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Form = require('../models/form');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DIR || '/tmp/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File upload validation
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// POST route for form submission
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { fullName, email, phoneNumber, message, isChecked } = req.body;
    const resumePath = req.file.path;

    const formData = new Form({
      fullName,
      email,
      phoneNumber,
      resume: resumePath,
      message,
      isChecked
    });

    const savedForm = await formData.save();
    res.json(savedForm);
  } catch (err) {
    console.error('Error saving form data:', err);
    res.status(500).json({ error: 'Error saving form data' });
  }
});

module.exports = router;
