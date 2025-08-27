import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const AllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const initialFilter =
    location.state?.filter ||
    new URLSearchParams(location.search).get("filter") ||
    "all";
  const [filter, setFilter] = useState(initialFilter); // State for filtering (all, ongoing, history)

  const userInfo = useSelector((state) => state.user.userInfo); // Get logged-in user info from Redux store
  const loggedInUserEmail = userInfo?.email; // Get the user's email from Redux
  const loggedInUserId = userInfo?._id; // Get the user's ID from Redux

  // Fetch all appointments from the API
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointments/all"
      ); // Replace with actual API endpoint
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

  // If navigation state changes, sync the filter
  useEffect(() => {
    const next =
      location.state?.filter ||
      new URLSearchParams(location.search).get("filter") ||
      "all";
    setFilter(next);
  }, [location.state, location.search]);

  // Filter appointments based on logged-in user's email
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.email === loggedInUserEmail
  );
  // Filter by ongoing and history
  const filteredByStatus = filteredAppointments.filter((appointment) => {
    if (filter === "ongoing") return appointment.status !== "completed"; // Only appointments not completed
    if (filter === "history") return appointment.status === "completed"; // Only completed appointments
    return true; // For 'all' filter, return everything
  });

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center text-slate-600">
        Loading appointments...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Medi<span className="text-blue-200">Care</span>
          </h1>
          <p className="text-blue-100">View and manage your appointments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">My Appointments</h2>
            <div className="flex items-center gap-3">
              <label htmlFor="filter" className="text-blue-100 text-sm">
                Filter:
              </label>
              <select
                id="filter"
                className="px-3 py-2 rounded-lg bg-white/90 text-slate-800 focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="ongoing">Ongoing</option>
                <option value="history">History</option>
              </select>
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="min-w-full bg-white border border-slate-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-700">
                  <th className="py-3 px-4">Patient ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Contact No</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredByStatus.length > 0 ? (
                  filteredByStatus.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="border-t last:border-b-0 hover:bg-slate-50/60"
                    >
                      <td className="py-3 px-4">{loggedInUserId}</td>
                      <td className="py-3 px-4">{appointment.patientName}</td>
                      <td className="py-3 px-4">{appointment.doctor}</td>
                      <td className="py-3 px-4">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{appointment.timeSlot}</td>
                      <td className="py-3 px-4">{appointment.contactNo}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAppointment;
