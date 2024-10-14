// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment', // Reference to Appointment model
        required: true,
    },
    amount: {
        type: Number,
        default: 10000, // Each appointment costs Rs. 10,000
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending'], // Payment status
        default: 'Paid',
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
