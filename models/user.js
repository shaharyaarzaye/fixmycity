const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  // Ensure unique usernames
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure unique usernames
    },
    password: {
        type: String,
        required: true,
    }
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
