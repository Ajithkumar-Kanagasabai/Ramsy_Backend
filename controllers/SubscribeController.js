const Subscription = require('../models/subscribe');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ajithkanagasabai17@gmail.com',
    pass: 'eoma jjcm wrhv mlfb'  // Move to environment variables for security
  }
});

exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'The email field should not be empty.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  try {
    let existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed.' });
    }

    // Create a new subscription
    let newSubscription = new Subscription({ email });
    await newSubscription.save();

    // Send a confirmation email
    const mailOptions = {
      from: 'ajithkanagasabai17@gmail.com',
      to: email,  // Ensure the user's email is correctly assigned
      subject: 'Rhc360 Solutions Email Subscription Confirmation',
      text: 'Hi User, Thank you for subscribing with us! From now on you will receive the latest job alerts and notifications from our website.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);  // Log the error for debugging
        // Still respond with success, but inform about email issue
        return res.status(200).json({ message: 'Subscription successful but failed to send confirmation email.' });
      } else {
        return res.status(200).json({ message: 'Subscription successful and confirmation email sent.' });
      }
    });

  } catch (error) {
    console.error('Server error:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Server error occurred.' });
  }
};
