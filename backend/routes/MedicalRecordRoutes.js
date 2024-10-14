// routes/MedicalRecordRoutes.js
const express = require('express');
const { createMedicalRecord, getAllMedicalRecords } = require('../controllers/MedicalRecordController');
const router = express.Router();

// Route to create a medical record
router.post('/create', createMedicalRecord);

// Route to get all medical records
router.get('/all', getAllMedicalRecords);

module.exports = router;
