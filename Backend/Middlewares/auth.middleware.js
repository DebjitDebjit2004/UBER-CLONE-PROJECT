const userModel = require('../Models/user.model');
const captainModel = require('../Models/captain.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../Models/blacklist.token.model');

// User Authentication
module.exports.authUser = async (req, res, next) => {
    // Get the token from the request
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    // If token does not exist, return an error
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    // If token is blacklisted, return an error
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    // Verify the token
    try {

        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the id
        const user = await userModel.findById(decoded._id);  

        // Set the user in the request object
        req.user = user;

        // Return the next middleware
        return next();
    } catch (error) {
        // If there is an error, return an error
        return res.status(401).json({ message: 'Unauthorized Access' });
    }
}

// Captain Authentication
module.exports.authCaptain = async (req, res, next) => {
    // Get the token from the request
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    // If token does not exist, return an error
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    // If token is blacklisted, return an error
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the token
    try {
        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the captain by the id
        const captain = await captainModel.findById(decoded._id)
        // Set the captain in the request object
        req.captain = captain;
        // Return the next middleware
        return next()

    } catch (err) {
        // If there is an error, return an error
        console.log(err);
        // Return an error
        res.status(401).json({ message: 'Unauthorized' });
    }
}