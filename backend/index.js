const express = require('express')
const app = express()
const { google } = require('googleapis');
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser  = require('body-parser')

dotenv.config()
try {
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
})
    
} catch (error) {
    console.log(error);
    
}
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-HTTP-Method-Override", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Credentials"]
}))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 


const {authUrl} = require("./routes/googleRefreshToken")


app.get('/auth/google', (req, res) => {
    res.redirect(authUrl);
});


app.get('/auth/google/callback', async (req, res) => {
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
});-

app.get("/", (req, res) => {
    res.send("Hello World!")
})
app.use("/admin", require("./routes/adminRoute"))


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})