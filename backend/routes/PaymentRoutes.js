// routes/PaymentRoutes.js
const express = require('express');
const { createPayment, getAllPayments } = require('../controllers/PaymentController');
const router = express.Router();

// Route to create a payment
router.post('/create', createPayment);

// Route to get all payment history
router.get('/history', getAllPayments);

module.exports = router;
