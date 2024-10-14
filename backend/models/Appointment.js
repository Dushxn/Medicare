// models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    doctor: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending',
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
