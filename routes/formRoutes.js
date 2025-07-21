// routes/formRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadToS3 } = require('../utils/s3Uploader'); // Import the S3 upload utility
const Form = require('../models/form');
const nodemailer = require('nodemailer');
const axios = require('axios');

const router = express.Router();

// Multer configuration for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });



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

    await axios.post(
  'https://a.klaviyo.com/api/events/',
  {
    data: {
      type: 'event',
      attributes: {
        profile: {
          email:process.env.KLAVIYO_NOTIFICATION_EMAIL // <- Notification recipient
        },
        metric: {
          name: 'Job Application Form Submission'
        },
        properties: {
          fullName,
          email,
          phoneNumber,
          message,
          resumeURL
        }
      }
    }
  },
  {
    headers: {
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
      'Content-Type': 'application/json',
      revision: '2023-02-22'
    }
  }
);

     

    res.status(201).json({ message: 'Job form data saved successfully and email sent' });

  } catch (error) {
    console.error('Error saving job form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
