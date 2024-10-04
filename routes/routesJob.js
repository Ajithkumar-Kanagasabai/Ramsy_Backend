const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const Token = require('../models/Token');

router.get('/CrmJobs', async (req, res) => {
    try {
        const tokenDocument = await Token.findOne().sort({ createdAt: -1 }).exec();
        
        const idToken = tokenDocument.id_token;
        let response = await fetch('https://rhc.vincere.io/api/v2/position/search/fl=id,job_type,job_title,keywords,job_summary,monthly_pay_rate,location,job_type,employment_type?limit=100', {
            method: 'GET',
            headers: {

                'accept': 'application/json',
                'id-token': idToken,
                'x-api-key': '79f19895-e400-431e-9abf-6e30a7470a10',
            },
        });


        if (response.status === 401) {
            const newToken = await refreshAccessToken();            
            const result = await Token.updateOne(
                {},
                {
                    $set: {
                        id_token: newToken.id_token,
                    }
                }
            );

            response = await fetch('https://rhc.vincere.io/api/v2/position/search/fl=id,job_type,job_title,keywords,job_summary,monthly_pay_rate,location,job_type,employment_type?limit=100', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'id-token': newToken.id_token,
                    'x-api-key': '79f19895-e400-431e-9abf-6e30a7470a10',
                },
            });
        }

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ message: 'Failed to fetch jobs' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error',error });
    }
});
router.get('/CrmJobsdetails', async (req, res) => {
    const id = req.query.id
    try {
        const tokenDocument = await Token.findOne().sort({ createdAt: -1 }).exec();
        
        const idToken = tokenDocument.id_token;
        let response = await fetch(`https://rhc.vincere.io/api/v2/position/${id}`, {
            method: 'GET',
            headers: {

                'accept': 'application/json',
                'id-token': idToken,
                'x-api-key': '79f19895-e400-431e-9abf-6e30a7470a10',
            },
        });


        if (response.status === 401) {
            const newToken = await refreshAccessToken(); 
            const result = await Token.updateOne(
                {},
                {
                    $set: {
                        id_token: newToken,
                    }
                }
            );

            response = await fetch(`https://rhc.vincere.io/api/v2/position/${id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'id-token': newToken,
                    'x-api-key': '79f19895-e400-431e-9abf-6e30a7470a10',
                },
            });
        }

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ message: 'Failed to fetch jobs' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error',error });
    }
});
const refreshAccessToken = async () => {
    const tokenDocument = await fetchTokenFromDatabase();
    try {
        const refresh_token = tokenDocument.refresh_token;
        const response = await fetch(`https://id.vincere.io/oauth2/token?client_id=18645e40-e9b9-4e41-ae94-1a7f68772a73&grant_type=refresh_token&refresh_token=${refresh_token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        
        // Check if the response was not successful
        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        // Await the promise before logging or returning the JSON
        const jsonResponse = await response.json();        
        return jsonResponse;

    } catch (error) {
        console.log("error", error); // Using the correct error variable here
    }
};

const fetchTokenFromDatabase = async () => {
    try {
        const tokenDocument = await Token.findOne().sort({ createdAt: -1 }).exec();
        return tokenDocument;
    } catch (error) {
        console.error('Error fetching token from database:', error);
        throw error;
    }
};
module.exports = router;
