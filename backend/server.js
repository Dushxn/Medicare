require('dotenv').config(); // Load environment variables
const express = require('express');

require('./DbConfig/db'); // Import the database connection


const userRoutes = require('./routes/userRoutes'); // Import user routes
const healthCardRoutes = require('./routes/HealthCardRoutes'); // Import health card routes
const appointmentRoutes = require('./routes/AppointmentRoutes');
const medicalRecordRoutes = require('./routes/MedicalRecordRoutes');
const staffScheduleRoutes = require('./routes/StaffScheduleRoutes');
const paymentRoutes = require('./routes/PaymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);
app.use('/api/health-cards', healthCardRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/staff-schedules', staffScheduleRoutes);
app.use('/api/payments', paymentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
