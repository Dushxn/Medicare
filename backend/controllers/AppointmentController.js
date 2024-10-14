// controllers/AppointmentController.js
const AppointmentRepository = require('../repositories/AppointmentRepository');

// Create an appointment
const createAppointment = async (req, res) => {
    try {
        const { patientName, email, contactNo, specialization, doctor, date, timeSlot, location, status } = req.body;
        
        const newAppointment = await AppointmentRepository.createAppointment({
            patientName, email, contactNo, specialization, doctor, date, timeSlot, location, status
        });
        
        return res.status(201).json({ message: 'Appointment created successfully', appointment: newAppointment });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update (Reschedule) appointment
const rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId, date, timeSlot } = req.body;

        // Find and update the appointment
        const updatedAppointment = await AppointmentRepository.updateAppointmentById(appointmentId, { date, timeSlot });
        
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        return res.status(200).json({ message: 'Appointment rescheduled successfully', appointment: updatedAppointment });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const deletedAppointment = await AppointmentRepository.deleteAppointmentById(appointmentId);

        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        return res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await AppointmentRepository.getAllAppointments();
        return res.status(200).json({ appointments });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createAppointment,
    rescheduleAppointment,
    deleteAppointment,
    getAllAppointments
};
