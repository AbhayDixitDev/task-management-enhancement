const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World!")
})
app.use("/admin", require("./routes/adminRoute"))


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})