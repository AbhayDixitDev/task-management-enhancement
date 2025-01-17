const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // This is important to get a refresh token
    scope: ['https://www.googleapis.com/auth/drive.file'],
});

router.get('/auth/google', (req, res) => {
    res.redirect(authUrl);
});

router.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Save the refresh token securely
        console.log('Refresh Token:', tokens.refresh_token);
        res.send('Authentication successful! You can close this tab.');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Authentication failed.');
    }
});


module.exports ={
    authUrl
}