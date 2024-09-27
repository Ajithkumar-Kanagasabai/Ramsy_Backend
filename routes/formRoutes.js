const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const Form = require('../models/form');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
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

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ajithkanagasabai17@gmail.com',
        pass: 'eoma jjcm wrhv mlfb'
      }
    });

    let mailOptions = {
      from: 'ajithkanagasabai17@gmail.com',
      to: 'ajithkumar.kanagasabai@grethena.com',
      subject: 'New Form Submission',
      text: `You have received a new form submission:\n\nFull Name: ${fullName}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${message}\nChecked: ${isChecked}\nResume Path: ${resumePath}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json(savedForm);
  } catch (err) {
    console.error('Error saving form data:', err.message); // More detailed error message
    res.status(500).json({ error: `Error saving form data: ${err.message}` });
  }
});

module.exports = router;
