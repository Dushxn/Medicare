// controllers/PaymentController.js
const PaymentRepository = require('../repositories/PaymentRepository');

// Create a payment for an appointment
const createPayment = async (req, res) => {
    const { appointmentId } = req.body;

    try {
        const newPayment = await PaymentRepository.createPayment(appointmentId);
        return res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all payment history
const getAllPayments = async (req, res) => {
    try {
        const payments = await PaymentRepository.getAllPayments();
        return res.status(200).json({ payments });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
};
