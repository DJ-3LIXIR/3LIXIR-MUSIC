const express = require('express');
const router = express.Router();
const axios = require('axios');

// Function to get fresh access token using refresh token
async function getAccessToken() {
  try {
    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
}

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get fresh access token
    const accessToken = await getAccessToken();

    // Add subscriber to Zoho Campaigns
    const response = await axios.post(
      `https://campaigns.zoho.com/api/v1.1/json/listsubscribe`,
      {
        listkey: process.env.ZOHO_LIST_KEY,
        contactinfo: {
          'Contact Email': email,
          'First Name': firstName || '',
          'Last Name': lastName || ''
        },
        resfmt: 'JSON'
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!',
      data: response.data
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to subscribe to newsletter',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;