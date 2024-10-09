const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    issuetype: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,  // This will store the URL or path to the image
        required: true // Set to true if you want to make it mandatory
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Issue', issueSchema);