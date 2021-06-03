require("dotenv").config();
const mongoose = require('mongoose');
const config = require('./config');

const DATABASE_URL = config.connectionString;

const connectDb = () => {
    return mongoose.connect(DATABASE_URL, {
        keepAlive: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }, error => {
        if (error) {
            console.log("Connection to DB failed!!");
        }
        else {
            console.log('Connection to DB Success!!');
        }
    });
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

module.exports = connectDb;