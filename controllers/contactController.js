const Contact = require('../models/contact');

const createContact = async (req, res) => {
  try {
    const { name, phone, email, enquiryType, message } = req.body;
    const newContact = new Contact({
      name,
      phone,
      email,
      enquiryType,
      message
    });
    await newContact.save();
    res.status(201).json({ message: 'Contact form data saved successfully' });
  } catch (error) {
    console.error('Error saving contact form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createContact
};
