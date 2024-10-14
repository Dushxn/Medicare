import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../shared/Sidebar';
import AdminSideSideBar from '../../../shared/AdminSideBar';

const AppointmentControl = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [cancelAppointmentId, setCancelAppointmentId] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    // Fetch all appointments from the backend
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/all'); // Adjust API endpoint as necessary
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Handle rescheduling an appointment
  const handleReschedule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/api/appointments/reschedule', {
        appointmentId,
        date: newDate,
        timeSlot: newTimeSlot,
      });

      // Update the appointments state with the rescheduled appointment
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId // Check against _id to match correctly
            ? { ...appointment, date: newDate, timeSlot: newTimeSlot }
            : appointment
        )
      );

      alert(response.data.message); // Notify user
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  // Handle deleting an appointment
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete('http://localhost:5000/api/appointments/delete', {
        data: { appointmentId: cancelAppointmentId },
      });

      // Update the appointments state to remove the deleted appointment
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== cancelAppointmentId) // Check against _id to match correctly
      );

      alert(response.data.message); // Notify user
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div className="flex">
      <AdminSideSideBar />
      <div className="flex-1 p-6 pl-20">
        <h1 className='text-[40px] font-bold text-start'>Medi<span className='text-blue-500'>Care</span></h1>
        <h2 className="text-xl font-semibold mb-4 text-start">Ongoing Appointments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.contactNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.timeSlot}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex mt-8 space-x-8">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointments</h3>
            <form onSubmit={handleReschedule}>
              <input 
                type="text" 
                placeholder="Appointment ID" 
                value={appointmentId} 
                onChange={(e) => setAppointmentId(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                type="date" 
                placeholder="Date" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                type="text" 
                placeholder="Time Slot" 
                value={newTimeSlot} 
                onChange={(e) => setNewTimeSlot(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Notify Patient
              </button>
            </form>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Cancel Appointments</h3>
            <form onSubmit={handleDelete}>
              <input 
                type="text" 
                placeholder="Appointment ID" 
                value={cancelAppointmentId} 
                onChange={(e) => setCancelAppointmentId(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <textarea 
                placeholder="Reason" 
                value={cancelReason} 
                onChange={(e) => setCancelReason(e.target.value)} 
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              ></textarea>
              <button type="submit" className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                Notify Patient
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentControl;
