// User Model Requires
const userModel = require('../Models/user.model');

// User Service Requires
const userService = require('../Services/user.service');

// Express Validator Requires
const { validationResult } = require('express-validator');


// Register User
module.exports.registerUser = async(req, res, next) => {
    // Check for validation errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    // Get the user input
    const {fullName, email, password} = req.body;

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