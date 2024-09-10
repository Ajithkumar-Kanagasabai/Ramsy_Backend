const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getAJob);

router.post('/exchange-code', async (req, res) => {
    const { code } = req.body;
    const clientId = '18645e40-e9b9-4e41-ae94-1a7f68772a73';// Replace with your actual client secret
    const redirectUri = 'https://ramsy-e3eaa.web.app/JobsPage';
    const tokenUrl = 'https://id.vincere.io/oauth2/token';
  
    try {
      const response = await axios.post(tokenUrl, new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
      }));
      
      res.json(response.data); // Contains access token and other information
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      res.status(500).json({ error: 'Failed to exchange code for token' });
    }
  });

module.exports = router;
