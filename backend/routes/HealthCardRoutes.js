// routes/HealthCardRoutes.js
const express = require('express');
const { registerHealthCard,getHealthCardDetails } = require('../controllers/HealthCardController');
const router = express.Router();

// Route to handle health card registration
router.post('/register', registerHealthCard);

// Route to get health card details by email
router.get('/details/:email', getHealthCardDetails);

module.exports = router;
