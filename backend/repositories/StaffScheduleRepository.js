// repositories/StaffScheduleRepository.js
const StaffSchedule = require('../models/StaffSchedule');

// Create a staff schedule
const createStaffSchedule = async (data) => {
    try {
        const newSchedule = new StaffSchedule(data);
        return await newSchedule.save();
    } catch (error) {
        throw error;
    }
};

// Get all staff schedules
const getAllStaffSchedules = async () => {
    try {
        return await StaffSchedule.find();
    } catch (error) {
        throw error;
    }
};

// Update a staff schedule by ID
const updateStaffScheduleById = async (id, data) => {
    try {
        return await StaffSchedule.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createStaffSchedule,
    getAllStaffSchedules,
    updateStaffScheduleById
};
