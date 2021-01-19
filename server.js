require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");
const express = require('express');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
}));

// Router
app.use('/user', require('./router/user.router'));


// Connect mongoodb
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err => {
    if (err) throw err;
    console.log("Connect to mongodb successfully")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App listen port ${PORT}`)
})

app.get("/", (req, res) => {
    res.json("Hello world 🚀 🐊");
})