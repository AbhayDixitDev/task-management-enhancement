const { google } = require('googleapis');

const getOAuth2Client = () => {
    
    const oAuth2Client = new google.auth.OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, process.env.GMAIL_REDIRECT_URI);
    return oAuth2Client;
};


const sendEmail = async (to, subject, text) => {
    const oAuth2Client = getOAuth2Client();
    const token = {access_token:process.env.GMAIL_ACCESS_TOKEN}
    oAuth2Client.setCredentials(token);

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const email = [
        `From: ${process.env.EMAIL_USER}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        text,
    ].join('\n');

    const base64EncodedEmail = Buffer.from(email).toString('base64').replace(/=/g, '');
    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: base64EncodedEmail,
        },
    });
};

module.exports = sendEmail