// models/HealthCard.js
const mongoose = require('mongoose');

const HealthCardSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    NIC: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('HealthCard', HealthCardSchema);
