// routes/AppointmentRoutes.js
const express = require('express');
const { createAppointment, rescheduleAppointment, deleteAppointment, getAllAppointments, getAppointmentsByTimeSlot } = require('../controllers/AppointmentController');
const router = express.Router();

// Route to create a new appointment
router.post('/create', createAppointment);

// Route to reschedule an appointment
router.put('/reschedule', rescheduleAppointment);

// Route to delete an appointment
router.delete('/delete', deleteAppointment);

// Route to get all appointments
router.get('/all', getAllAppointments);

// Route to get appointments grouped by timeSlot
router.get('/time-slot-analysis', getAppointmentsByTimeSlot);

module.exports = router;
