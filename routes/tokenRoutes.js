const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const fetch = require('node-fetch');

// Define the route to handle job fetching
router.get('/fetch-jobs', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://id.vincere.io/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                client_id: '18645e40-e9b9-4e41-ae94-1a7f68772a73',
            }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok) {
            return res.status(400).json({ error: tokenData.error || 'Failed to exchange code for token' });
        }

        const { id_token, refresh_token } = tokenData;

        // Save the tokens to the database
        await saveTokenToBackend(id_token, refresh_token);

        // Fetch job positions
        const jobResponse = await fetch('https://rhc.vincere.io/api/v2/position/search/fl=id,job_type,job_title,keywords,job_summary,monthly_pay_rate,location,job_type,employment_type?limit=100', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'id-token': id_token,
                'x-api-key': '79f19895-e400-431e-9abf-6e30a7470a10',
            },
        });

        const jobData = await jobResponse.json();
        if (!jobResponse.ok) {
            return res.status(400).json({ error: jobData.error || 'Failed to fetch jobs' });
        }

        // Return the fetched jobs
        res.status(200).json({ jobs: jobData.result.items });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to save the token to the database
const saveTokenToBackend = async (id_token, refresh_token) => {
    try {
        const newToken = new Token({ id_token, refresh_token });
        await newToken.save();
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

module.exports = router;
