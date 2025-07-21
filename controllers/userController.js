// controllers/userController.js
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const axios = require('axios');



// Register User
const registerUser = async (req, res) => {
  const { name, lastName, email, phone, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();
    // Get all lists
const KLAVIYO_PRIVATE_KEY = process.env.KLAVIYO_PRIVATE_KEY; // starts with pk_
const desiredListName = 'New User';

try {
  // Step 1: Create (or get) profile
  const profileRes = await axios.post(
    'https://a.klaviyo.com/api/profiles/',
    {
      data: {
        type: 'profile',
        attributes: {
          email: email,
        }
      }
    },
    {
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
        revision: '2023-02-22'
      }
    }
  );

  const profileId = profileRes.data.data.id;

  // Step 2: Get all lists
  const listsRes = await axios.get(
    'https://a.klaviyo.com/api/lists/',
    {
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
        revision: '2023-02-22'
      }
    }
  );

  // Step 3: Find or create list
  const existingList = listsRes.data.data.find(
    (list) => list.attributes.name === desiredListName
  );

  let listId;

  if (existingList) {
    listId = existingList.id;
  } else {
    const newListRes = await axios.post(
      'https://a.klaviyo.com/api/lists/',
      {
        data: {
          type: 'list',
          attributes: {
            name: desiredListName
          }
        }
      },
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
          'Content-Type': 'application/json',
          revision: '2023-02-22'
        }
      }
    );

    listId = newListRes.data.data.id;
  }

  // Step 4: Subscribe the user using profile ID
  await axios.post(
    `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`,
    {
      data: [
        {
          type: 'profile',
          id: profileId // ✅ required
        }
      ]
    },
    {
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
        revision: '2023-02-22'
      }
    }
  );
} catch (error) {
  console.error('Klaviyo Integration Error:', error?.response?.data || error.message);
}


    res.status(200).json({ msg: 'User registered successfully' });
  } catch (error) {
  console.error('Klaviyo Error:', error?.response?.data || error.message);
  res.status(500).json({ msg: 'Error in registration', error: error?.response?.data || error.message });
}

};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    const isPasswordHashed = user.password.startsWith('$2');

    if (!isPasswordHashed) {
      // Stored password is plain text; check directly
      if (user.password === password) {
        // First-time hash and save
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ msg: 'Password secured and user logged in' });
      } else {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    }

    // Compare with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.status(200).json({ msg: 'User signed in successfully' });
  } catch (error) {
    console.error('Login error:', error);
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

    const resetUrl = `https://rhc360.com/reset-password/${token}`;
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
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ msg: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error in resetting password' });
  }
};


module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
