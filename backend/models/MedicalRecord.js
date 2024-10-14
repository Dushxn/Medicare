// models/MedicalRecord.js
const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
    patientID: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    symptoms: {
        type: String,
        required: true,
    },
    labTestResults: {
        type: String,
        required: true,
    },
    treatments: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
