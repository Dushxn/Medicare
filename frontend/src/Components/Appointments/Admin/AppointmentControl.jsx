"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, Clock, Edit, Trash2, AlertTriangle } from "lucide-react"

const AppointmentControl = () => {
  const [appointments, setAppointments] = useState([])
  const [appointmentId, setAppointmentId] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newTimeSlot, setNewTimeSlot] = useState("")
  const [cancelAppointmentId, setCancelAppointmentId] = useState("")
  const [cancelReason, setCancelReason] = useState("")

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/appointments/all")
        setAppointments(response.data.appointments)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [])

  const handleReschedule = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put("http://localhost:5000/api/appointments/reschedule", {
        appointmentId,
        date: newDate,
        timeSlot: newTimeSlot,
      })

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, date: newDate, timeSlot: newTimeSlot } : appointment,
        ),
      )

      alert(response.data.message)
      setAppointmentId("")
      setNewDate("")
      setNewTimeSlot("")
    } catch (error) {
      console.error("Error rescheduling appointment:", error)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.delete("http://localhost:5000/api/appointments/delete", {
        data: { appointmentId: cancelAppointmentId },
      })

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== cancelAppointmentId),
      )

      alert(response.data.message)
      setCancelAppointmentId("")
      setCancelReason("")
    } catch (error) {
      console.error("Error deleting appointment:", error)
    }
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
            <p className="text-blue-100 mt-1">Appointment Management System</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Ongoing Appointments
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Appointment ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned Doctor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time Slot</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">{appointment._id}</td>
                    <td className="px-6 py-4 text-gray-600">{appointment.patientName}</td>
                    <td className="px-6 py-4 text-gray-600">{appointment.date}</td>
                    <td className="px-6 py-4 text-gray-600">{appointment.doctor}</td>
                    <td className="px-6 py-4 text-gray-600">{appointment.contactNo}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {appointment.timeSlot}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          appointment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reschedule Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Reschedule Appointments
              </h3>
            </div>

            <div className="p-6">
              <form onSubmit={handleReschedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment ID</label>
                  <input
                    type="text"
                    placeholder="Enter Appointment ID"
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Time Slot</label>
                  <input
                    type="text"
                    placeholder="Enter Time Slot"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Edit className="h-4 w-4" />
                  Notify Patient
                </button>
              </form>
            </div>
          </div>

          {/* Cancel Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Cancel Appointments
              </h3>
            </div>

            <div className="p-6">
              <form onSubmit={handleDelete} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment ID</label>
                  <input
                    type="text"
                    placeholder="Enter Appointment ID"
                    value={cancelAppointmentId}
                    onChange={(e) => setCancelAppointmentId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason</label>
                  <textarea
                    placeholder="Enter reason for cancellation"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  Cancel & Notify Patient
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentControl
