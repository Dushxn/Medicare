import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Sidebar from '../../shared/Sidebar';

const AllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // State for filtering (all, ongoing, history)

  const userInfo = useSelector(state => state.user.userInfo); // Get logged-in user info from Redux store
  const loggedInUserEmail = userInfo?.email; // Get the user's email from Redux
  const loggedInUserId = userInfo?._id; // Get the user's ID from Redux

  // Fetch all appointments from the API
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments/all'); // Replace with actual API endpoint
      setAppointments(response.data.appointments);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments based on logged-in user's email
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.email === loggedInUserEmail
  );

  // Filter by ongoing and history
  const filteredByStatus = filteredAppointments.filter((appointment) => {
    if (filter === 'ongoing') return appointment.status !== 'pending';
    if (filter === 'history') return appointment.status === 'pending';
    return true;
  });

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar />

      <div className="p-4 lg:pl-10 lg:flex w-full lg:gap-x-96">
        <div className="w-full lg:w-auto flex flex-col items-start lg:pl-20">
        <h1 className="text-[32px] lg:text-[40px] font-bold mb-6 lg:mb-8">
            Medi<span className="text-blue-500">Care</span>
          </h1>
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">My Appointments</h1>

          <div className="mb-4">
            <label htmlFor="filter" className="mr-2">Filter by:</label>
            <select
              id="filter"
              className="p-2 border rounded bg-white text-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="ongoing">Ongoing Appointments</option>
              <option value="history">Appointment History</option>
            </select>
          </div>

          <table className="min-w-full bg-white border border-gray-300 rounded shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Patient ID</th>
                <th className="py-2 px-4">Patient Name</th>
                <th className="py-2 px-4">Doctor</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Time Slot</th>
                <th className="py-2 px-4">Contact No</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredByStatus.length > 0 ? (
                filteredByStatus.map((appointment) => (
                  <tr key={appointment._id} className="border-t">
                    <td className="py-2 px-4">{loggedInUserId}</td>
                    <td className="py-2 px-4">{appointment.patientName}</td>
                    <td className="py-2 px-4">{appointment.doctor}</td>
                    <td className="py-2 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{appointment.timeSlot}</td>
                    <td className="py-2 px-4">{appointment.contactNo}</td>
                    <td className="py-2 px-4 text-blue-500">{appointment.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllAppointment;
