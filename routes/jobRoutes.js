const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getAJob);

module.exports = router;
