// repositories/AppointmentRepository.js
const Appointment = require('../models/Appointment');

const createAppointment = async (data) => {
    try {
        const newAppointment = new Appointment(data);
        return await newAppointment.save();
    } catch (error) {
        throw error;
    }
};

const getAppointmentById = async (id) => {
    try {
        return await Appointment.findById(id);
    } catch (error) {
        throw error;
    }
};

const updateAppointmentById = async (id, data) => {
    try {
        return await Appointment.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw error;
    }
};

const deleteAppointmentById = async (id) => {
    try {
        return await Appointment.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
};

const getAllAppointments = async () => {
    try {
        return await Appointment.find();
    } catch (error) {
        throw error;
    }
};
const getAppointmentsGroupedByTimeSlot = async () => {
    try {
        return await Appointment.aggregate([
            {
                $group: {
                    _id: '$timeSlot', // Group by timeSlot
                    count: { $sum: 1 }, // Count the number of appointments for each timeSlot
                }
            }
        ]);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createAppointment,
    getAppointmentById,
    updateAppointmentById,
    deleteAppointmentById,
    getAllAppointments,
    getAppointmentsGroupedByTimeSlot
};
