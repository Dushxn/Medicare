// routes/StaffScheduleRoutes.js
const express = require('express');
const { createStaffSchedule, getAllStaffSchedules, updateStaffSchedule } = require('../controllers/StaffScheduleController');
const router = express.Router();

// Route to create a staff schedule
router.post('/create', createStaffSchedule);

// Route to get all staff schedules
router.get('/all', getAllStaffSchedules);

// Route to update a staff schedule
router.put('/update/:id', updateStaffSchedule); // ID is in the URL

module.exports = router;
