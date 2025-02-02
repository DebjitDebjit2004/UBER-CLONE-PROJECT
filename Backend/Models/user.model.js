const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Schema
const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, 'Too short, min is 3 characters'],
        },
        lastName: {
            type: String,
            minlength: [3, 'Too short, min is 3 characters'],
        },
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },

    password: {
        type: String,
        required: true,
        minlength: [ 8, 'Password must be at least 8 characters long' ],
        selet: false,
    },

    socketId: {
        type: String,
    }
})

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

// Compare password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// Hash the password before saving
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

// User Model
const userModel = mongoose.model('user', userSchema);

// Export the model
module.exports = userModel;