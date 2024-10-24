import React, { useState, useEffect } from 'react';
import AdminSideBar from '../../shared/AdminSideBar';
import axios from 'axios';

const StaffSchedule = () => {
  // State to store fetched schedules
  const [staffSchedules, setStaffSchedules] = useState([]);
  
  // State to store form inputs for adding a new schedule
  const [formData, setFormData] = useState({
    staffID: '',
    staffName: '',
    shift: '',
    department: '',
    position: '',
  });

  // State to store whether we're editing a schedule
  const [isEditing, setIsEditing] = useState(false);

  // State to store the current schedule being edited
  const [editScheduleId, setEditScheduleId] = useState(null);

  // Fetch the data from the backend
  useEffect(() => {
    const fetchStaffSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/staff-schedules/all');
        setStaffSchedules(response.data.schedules);
      } catch (error) {
        console.error('Error fetching staff schedules:', error);
      }
    };

    fetchStaffSchedules();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to add or update a schedule
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing schedule
        const response = await axios.put(`http://localhost:5000/api/staff-schedules/update/${editScheduleId}`, formData);
        console.log('Schedule updated:', response.data);

        // Update the state with the updated schedule
        const updatedSchedules = staffSchedules.map(schedule => 
          schedule._id === editScheduleId ? response.data.schedule : schedule
        );
        setStaffSchedules(updatedSchedules);

        // Reset editing state
        setIsEditing(false);
        setEditScheduleId(null);
      } else {
        // Create new schedule
        const response = await axios.post('http://localhost:5000/api/staff-schedules/create', formData);
        console.log('New schedule added:', response.data);
        
        // Add the new schedule to the list
        setStaffSchedules([...staffSchedules, response.data.schedule]);
      }

      // Clear the form
      setFormData({
        staffID: '',
        staffName: '',
        shift: '',
        department: '',
        position: '',
      });
    } catch (error) {
      console.error('Error adding/updating staff schedule:', error);
    }
  };

  // Handle editing a schedule
  const handleEdit = (schedule) => {
    setIsEditing(true);
    setEditScheduleId(schedule._id);

    // Pre-fill the form with the existing schedule data
    setFormData({
      staffID: schedule.staffID,
      staffName: schedule.staffName,
      shift: schedule.shift,
      department: schedule.department,
      position: schedule.position,
    });
  };

  return (
    <div className="flex">
      <AdminSideBar />

      <div className="flex-1 p-8 pl-20">
        <h1 className="text-[40px] font-bold text-start">
          Medi<span className="text-blue-500">Care</span>
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800">Staff Schedule</h2>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-600">Current Schedule</h3>

          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-4">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-6 text-left">Staff ID</th>
                <th className="py-3 px-6 text-left">Staff Name</th>
                <th className="py-3 px-6 text-left">Assigned Shift</th>
                <th className="py-3 px-6 text-left">Position</th>
                <th className="py-3 px-6 text-left">Department</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {staffSchedules.length > 0 ? (
                staffSchedules.map((staff, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 px-6 text-start">{staff.staffID}</td>
                    <td className="py-4 px-6 text-start">{staff.staffName}</td>
                    <td className="py-4 px-6 text-start">{staff.shift}</td>
                    <td className="py-4 px-6 text-start">{staff.position}</td>
                    <td className="py-4 px-6 text-start">{staff.department}</td>
                    <td className="py-4 px-6 text-start">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleEdit(staff)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                    No staff schedules available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-600">{isEditing ? 'Update Schedule' : 'Add New Schedule'}</h3>

          <form className="mt-4 flex space-x-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="staffID"
              placeholder="Staff ID"
              value={formData.staffID}
              onChange={handleInputChange}
              className="w-1/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="staffName"
              placeholder="Staff Name"
              value={formData.staffName}
              onChange={handleInputChange}
              className="w-1/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="shift"
              placeholder="Shift"
              value={formData.shift}
              onChange={handleInputChange}
              className="w-1/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-1/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-1/5 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              {isEditing ? 'Update Staff' : 'Add Staff'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffSchedule;
