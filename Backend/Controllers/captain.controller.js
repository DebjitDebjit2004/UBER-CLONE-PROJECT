const captainModel = require('../Models/captain.model');
const captainService = require('../Services/captain.service');
const blackListTokenModel = require('../Models/blacklist.token.model');
const { validationResult } = require('express-validator');

// Register Captain
module.exports.registerCaptain = async (req, res, next) => {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get the captain input
    const { fullname, email, password, vehicle } = req.body;

    // Check if captain already exists
    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    // If captain already exists, return an error
    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }

    // Hash the password
    const hashedPassword = await captainModel.hashPassword(password);

    // Create a new captain
    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    // Generate JWT token
    const token = captain.generateAuthToken();

    // Return the JWT token and captain
    res.status(201).json({ token, captain });

}

// Login Captain
module.exports.loginCaptain = async (req, res, next) => {

    // Check for validation errors
    const errors = validationResult(req);

    // If there are errors, return the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get the captain input
    const { email, password } = req.body;

    // Check if captain exists
    const captain = await captainModel.findOne({ email }).select('+password');

    // If captain does not exist, return an error
    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await captain.comparePassword(password);

    // If password does not match, return an error
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = captain.generateAuthToken();

    // Return the JWT token and captain
    res.cookie('token', token);

    // Return the JWT token and captain
    res.status(200).json({ token, captain });
}

// Get Captain Profile
module.exports.getCaptainProfile = async (req, res, next) => {
    // Return the captain
    res.status(200).json({ captain: req.captain });
}

// Update Captain Profile
module.exports.logoutCaptain = async (req, res, next) => {
    // Get the token
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    // Add the token to the blacklist
    await blackListTokenModel.create({ token });

    // Clear the cookie
    res.clearCookie('token');

    // Return a success message
    res.status(200).json({ message: 'Logout successfully' });
}