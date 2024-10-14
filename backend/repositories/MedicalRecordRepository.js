// repositories/MedicalRecordRepository.js
const MedicalRecord = require('../models/MedicalRecord');

// Create a medical record
const createMedicalRecord = async (data) => {
    try {
        const newRecord = new MedicalRecord(data);
        return await newRecord.save();
    } catch (error) {
        throw error;
    }
};

// Get all medical records
const getAllMedicalRecords = async () => {
    try {
        return await MedicalRecord.find();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createMedicalRecord,
    getAllMedicalRecords
};
