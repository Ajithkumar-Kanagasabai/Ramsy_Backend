const axios = require("axios");
const Contact = require("../models/contact");

const createContact = async (req, res) => {
  try {
    const { name, phone, email, enquiryType, message } = req.body;

    // 1. Save the contact details to the database
    const newContact = new Contact({
      name,
      phone,
      email,
      enquiryType,
      message,
    });
    await newContact.save();

    //  Send event to Klaviyo to trigger admin notification
await axios.post(
  'https://a.klaviyo.com/api/events/',
  {
    data: {
      type: 'event',
      attributes: {
        profile: {
         email:process.env.KLAVIYO_NOTIFICATION_EMAIL // Who should get notified
        },
        metric: {
          name: 'Contact Form Submission'
        },
        properties: {
          name,
          email,
          phone,
          enquiryType,
          message
        },
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

    // Send success response
    res.status(201).json({
      message: "Contact form data saved successfully and notification sent",
    });
  } catch (error) {
    console.error(
      "Error handling contact form or sending Klaviyo event:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createContact,
};
