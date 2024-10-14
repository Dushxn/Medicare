// controllers/MedicalRecordController.js
const MedicalRecordRepository = require('../repositories/MedicalRecordRepository');

// Insert medical record
const createMedicalRecord = async (req, res) => {
    try {
        const { patientID, patientName, condition, symptoms, labTestResults, treatments, notes } = req.body;
        
        const newRecord = await MedicalRecordRepository.createMedicalRecord({
            patientID, patientName, condition, symptoms, labTestResults, treatments, notes
        });
        
        return res.status(201).json({ message: 'Medical record created successfully', record: newRecord });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all medical records
const getAllMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecordRepository.getAllMedicalRecords();
        return res.status(200).json({ records });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createMedicalRecord,
    getAllMedicalRecords
};
