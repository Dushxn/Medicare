"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, Clock, Users, Plus, Edit } from "lucide-react"

const StaffSchedule = () => {
  const [staffSchedules, setStaffSchedules] = useState([])
  const [formData, setFormData] = useState({
    staffID: "",
    staffName: "",
    shift: "",
    department: "",
    position: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editScheduleId, setEditScheduleId] = useState(null)

  useEffect(() => {
    const fetchStaffSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/staff-schedules/all")
        setStaffSchedules(response.data.schedules)
      } catch (error) {
        console.error("Error fetching staff schedules:", error)
      }
    }

    fetchStaffSchedules()
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:5000/api/staff-schedules/update/${editScheduleId}`, formData)
        const updatedSchedules = staffSchedules.map((schedule) =>
          schedule._id === editScheduleId ? response.data.schedule : schedule,
        )
        setStaffSchedules(updatedSchedules)
        setIsEditing(false)
        setEditScheduleId(null)
      } else {
        const response = await axios.post("http://localhost:5000/api/staff-schedules/create", formData)
        setStaffSchedules([...staffSchedules, response.data.schedule])
      }

      setFormData({
        staffID: "",
        staffName: "",
        shift: "",
        department: "",
        position: "",
      })
    } catch (error) {
      console.error("Error adding/updating staff schedule:", error)
    }
  }

  const handleEdit = (schedule) => {
    setIsEditing(true)
    setEditScheduleId(schedule._id)
    setFormData({
      staffID: schedule.staffID,
      staffName: schedule.staffName,
      shift: schedule.shift,
      department: schedule.department,
      position: schedule.position,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">
              Medi<span className="text-blue-200">Care</span>
            </h1>
            <p className="text-blue-100 mt-1">Staff Schedule Management</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Current Schedule Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Current Schedule
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Staff ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Staff Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned Shift</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffSchedules.length > 0 ? (
                  staffSchedules.map((staff, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{staff.staffID}</td>
                      <td className="px-6 py-4 text-gray-600">{staff.staffName}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {staff.shift}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{staff.position}</td>
                      <td className="px-6 py-4 text-gray-600">{staff.department}</td>
                      <td className="px-6 py-4">
                        <button
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          onClick={() => handleEdit(staff)}
                        >
                          <Edit className="h-4 w-4" />
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      No staff schedules available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Update Schedule Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              {isEditing ? "Update Schedule" : "Add New Schedule"}
            </h3>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID</label>
                <input
                  type="text"
                  name="staffID"
                  placeholder="Staff ID"
                  value={formData.staffID}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Name</label>
                <input
                  type="text"
                  name="staffName"
                  placeholder="Staff Name"
                  value={formData.staffName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
                <input
                  type="text"
                  name="shift"
                  placeholder="Shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  {isEditing ? "Update Staff" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffSchedule
