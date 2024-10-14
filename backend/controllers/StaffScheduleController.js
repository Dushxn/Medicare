// controllers/StaffScheduleController.js
const StaffScheduleRepository = require('../repositories/StaffScheduleRepository');

// Insert staff schedule
const createStaffSchedule = async (req, res) => {
    try {
        const { staffID, staffName, shift, position, department } = req.body;

        const newSchedule = await StaffScheduleRepository.createStaffSchedule({
            staffID, staffName, shift, position, department
        });

        return res.status(201).json({ message: 'Staff schedule created successfully', schedule: newSchedule });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all staff schedules
const getAllStaffSchedules = async (req, res) => {
    try {
        const schedules = await StaffScheduleRepository.getAllStaffSchedules();
        return res.status(200).json({ schedules });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update staff schedule
const updateStaffSchedule = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL
    const updateData = req.body; // Get the data to update from the request body

    try {
        const updatedSchedule = await StaffScheduleRepository.updateStaffScheduleById(id, updateData);
        
        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        return res.status(200).json({ message: 'Staff schedule updated successfully', schedule: updatedSchedule });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createStaffSchedule,
    getAllStaffSchedules,
    updateStaffSchedule
};
