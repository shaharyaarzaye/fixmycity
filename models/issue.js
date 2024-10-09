const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    issuetype: {
        type: String,
        required: true,
        enum: ['Potholes', 'Faulty Street Light', 'Garbage', 'Other'] // Add more types as needed
    },
    Description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String, // This will store the path to the uploaded image
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false // Changed to false
    },
    votes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the 'updatedAt' field before saving
IssueSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Issue', IssueSchema);