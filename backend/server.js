require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");

require("./DbConfig/db"); // Import the database connection

const app = express(); // Initialize the express app
const PORT = process.env.PORT || 5000; // Set the port

// Middleware to parse JSON
app.use(express.json());

// Set up CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow credentials (for cookies, authorization headers, etc.)
  })
);

// Serve uploaded files statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userRoutes = require("./routes/userRoutes"); // Import user routes
const healthCardRoutes = require("./routes/HealthCardRoutes"); // Import health card routes
const appointmentRoutes = require("./routes/AppointmentRoutes");
const medicalRecordRoutes = require("./routes/MedicalRecordRoutes");
const staffScheduleRoutes = require("./routes/StaffScheduleRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");

// Use the user routes
app.use("/api/users", userRoutes);
app.use("/api/health-cards", healthCardRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/staff-schedules", staffScheduleRoutes);
app.use("/api/payments", paymentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
