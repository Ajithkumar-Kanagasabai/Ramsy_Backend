const express = require('express');
const router = express.Router();
const Token = require('../models/Token');

// POST route to save the token
router.post('/save-token', async (req, res) => {

  try {
    const newToken = new Token({ ...req.body });
    await newToken.save();
    res.status(200).json({ message: 'Token saved successfully!' });
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
