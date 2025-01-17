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

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


const {authGoogle} = require("./utils/googleRefreshToken")
const {authGoogleCallback} = require("./utils/googleRefreshToken")

app.get('/auth/google',authGoogle) ;


app.get('/auth/google/callback', authGoogleCallback );-

app.get("/", (req, res) => {
    res.send("Hello World!")
})
app.use("/admin", require("./routes/adminRoute"))


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})