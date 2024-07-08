const Subscription = require('../models/subscribe');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ajithkanagasabai17@gmail.com',
    pass: 'eoma jjcm wrhv mlfb'
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
      to: email,
      subject: 'Ramsy Health Care Email Subscription Confirmation',
      text: 'Hi User, Thank you for subscribing with us! From now on you will receive the latest job alerts and notifications of our wesbsite.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send confirmation email.' });
      } else {
        return res.status(200).json({ message: 'Subscription successful and confirmation email sent.' });
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
