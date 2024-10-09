// routes/formRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadToS3 } = require('../utils/s3Uploader'); // Import the S3 upload utility
const Form = require('../models/form');
const nodemailer = require('nodemailer');

const router = express.Router();

// Multer configuration for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

let transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service provider (e.g., Gmail, Outlook, etc.)
  auth: {
    user: 'ajithkanagasabai17@gmail.com', // Replace with your email
    pass: 'eoma jjcm wrhv mlfb' // Replace with your email password
  }
});

// Route for handling form submission and file upload
router.post('/form', upload.single('resume'), async (req, res) => {
  try {
    const { fullName, email, phoneNumber, message } = req.body;
    const resume = req.file;

    if (!resume) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    // Upload resume to AWS S3
    const s3Response = await uploadToS3(resume);
    const resumeURL = s3Response.Location;

    const formSubmission = new Form({
      fullName,
      email,
      phoneNumber,
      message,
      resumeURL,
    });
    
    await formSubmission.save();

    let mailOptions = {
      from: 'ajithkanagasabai17@gmail.com', // Sender address
      to: 'ajithkumar.kanagasabai@grethena.com', // List of recipients
      subject: 'Job Application Form Submission', // Subject line
      text: `You have received a new job application form submission:\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phoneNumber}\nResume: ${resumeURL}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ message: 'Job form data saved successfully and email sent' });

  } catch (error) {
    console.error('Error saving job form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
