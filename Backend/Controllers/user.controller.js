// User Model Requires
const userModel = require('../Models/user.model');
const blackListTokenModel = require('../Models/blacklist.token.model');

// User Service Requires
const userService = require('../Services/user.service');

// Express Validator Requires
const { validationResult } = require('express-validator');


// Register User
module.exports.registerUser = async (req, res, next) => {
    // Check for validation errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    // Get the user input
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashPassword = await userModel.hashPassword(password);

    // Create a new user
    const user = await userService.createUser({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashPassword
    });

    // Generate JWT token
    const token = await user.generateAuthToken();

    // Return the JWT token and user
    return res.status(201).json({ token, user });
}

// Login User
module.exports.loginUser = async (req, res, next) => {
    // Check for validation errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    // Get the user input
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    // Compare the password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    // Generate JWT token
    const token = await user.generateAuthToken();

    // Set the JWT token in the cookie
    res.cookie('token', token);

    // Return the JWT token and user
    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);

}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}