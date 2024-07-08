const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/SubscribeController');

router.post('/', subscriptionController.subscribe);

module.exports = router;
