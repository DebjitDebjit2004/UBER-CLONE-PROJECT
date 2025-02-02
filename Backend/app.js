const dotenv = require('dotenv');
dotenv.config();

//NPM Modules
const express = require('express')
const cors = require('cors');

//File Reqiurements
const connectDatabase = require('./Database/connect.database');
const userRoutes = require('./Routes/user.routes');

//Express App
const app = express();

//Database Connection
connectDatabase();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/users', userRoutes);

module.exports = app;