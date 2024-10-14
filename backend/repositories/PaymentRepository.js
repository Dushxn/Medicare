// repositories/PaymentRepository.js
const Payment = require('../models/Payment');

// Create a payment record
const createPayment = async (appointmentId) => {
    try {
        const payment = new Payment({ appointmentId });
        return await payment.save();
    } catch (error) {
        throw error;
    }
};

// Get all payment records
const getAllPayments = async () => {
    try {
        return await Payment.find().populate('appointmentId'); // Populate appointment details
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createPayment,
    getAllPayments,
};
