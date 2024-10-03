const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  id_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token will expire after 1 hour
  },
});

module.exports = mongoose.model('Token', TokenSchema);
