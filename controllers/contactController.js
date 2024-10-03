const nodemailer = require('nodemailer');
const Contact = require('../models/contact');

const createContact = async (req, res) => {
  try {
    const { name, phone, email, enquiryType, message } = req.body;

    // Save the contact details to the database
    const newContact = new Contact({
      name,
      phone,
      email,
      enquiryType,
      message
    });
    await newContact.save();

    // Create a transporter object for sending the email
    let transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider (e.g., Gmail, Outlook, etc.)
      auth: {
        user: 'ajithkanagasabai17@gmail.com', // Replace with your email
        pass: 'eoma jjcm wrhv mlfb' // Replace with your email password
      }
    });

    // Set up the email data
    let mailOptions = {
      from: 'ajithkanagasabai17@gmail.com', // Sender address
      to: 'ajithkumar.kanagasabai@grethena.com', // List of recipients
      subject: 'New Contact Form Submission', // Subject line
      text: `You have received a new contact form submission:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nEnquiry Type: ${enquiryType}\nMessage: ${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // Send success response
    res.status(201).json({ message: 'Contact form data saved successfully and email sent' });

  } catch (error) {
    console.error('Error saving contact form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createContact
};
