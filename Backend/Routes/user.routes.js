const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// User Controller
const userController = require('../Controllers/user.controller');

// User Routes
router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], userController.registerUser);

// Export the router
module.exports = router;