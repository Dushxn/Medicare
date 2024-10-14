// routes/HealthCardRoutes.js
const express = require('express');
const { registerHealthCard } = require('../controllers/HealthCardController');
const router = express.Router();

// Route to handle health card registration
router.post('/register', registerHealthCard);

module.exports = router;
