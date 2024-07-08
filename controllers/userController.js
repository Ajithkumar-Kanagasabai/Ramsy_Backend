// controllers/userController.js
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');

const registerUser = async (req, res) => {
  const { name, lastName, email, phone, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      lastName,
      email,
      phone,
      password
    });

    await user.save();
    res.status(200).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error in registration' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    if (user.password !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.status(200).json({ msg: 'User signed in successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error in sign in' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User does not exist' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `https://ramsy-e3eaa.web.app/reset-password/${token}`;
    await sendEmail(user.email, 'Password Reset Request', `Please click the link to reset your password: ${resetUrl}`);

    res.status(200).json({ msg: 'Reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ msg: 'Error in forgot password' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ msg: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error in resetting password' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
