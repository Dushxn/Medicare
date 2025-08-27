"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { QrCode, UserPlus, Calendar, AlertCircle, CheckCircle, Camera } from "lucide-react"

const AdminProfile = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [nic, setNic] = useState("")
  const [gender, setGender] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [birthday, setBirthday] = useState("")
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertMessage, setAlertMessage] = useState(null)
  const [alertType, setAlertType] = useState("success")
  const [showAlert, setShowAlert] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()

    const nicRegex = /^[0-9]{9}[Vv]?$/
    const contactNoRegex = /^[0-9]{10}$/
    const nameRegex = /^[A-Za-z]+$/
    const genderOptions = ["Male", "Female", "Other"]

    if (!nicRegex.test(nic)) {
      setAlertMessage('Invalid NIC. It should be 9 digits followed by an optional "V" or "v".')
      setAlertType("error")
      setShowAlert(true)
      return
    }

    if (!contactNoRegex.test(contactNo)) {
      setAlertMessage("Invalid Contact No. It should be 10 digits.")
      setAlertType("error")
      setShowAlert(true)
      return
    }

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setAlertMessage("Names can only contain letters.")
      setAlertType("error")
      setShowAlert(true)
      return
    }

    if (!genderOptions.includes(gender)) {
      setAlertMessage('Invalid gender. Please select "Male", "Female", or "Other".')
      setAlertType("error")
      setShowAlert(true)
      return
    }

    try {
      const formData = new FormData()
      formData.append("firstName", firstName)
      formData.append("lastName", lastName)
      formData.append("email", email)
      formData.append("NIC", nic)
      formData.append("gender", gender)
      formData.append("contactNo", contactNo)
      if (photo) formData.append("photo", photo)
      if (bloodType) formData.append("bloodType", bloodType)

      const response = await axios.post("http://localhost:5000/api/health-cards/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setAlertMessage(response.data.message)
      setAlertType("success")
      setShowAlert(true)

      setFirstName("")
      setLastName("")
      setEmail("")
      setNic("")
      setGender("")
      setContactNo("")
      setBloodType("")
      setPhoto(null)
      setPhotoPreview(null)
    } catch (err) {
      setAlertMessage(err.message)
      setAlertType("error")
      setShowAlert(true)
    }
  }

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments/all")
      if (!response.data.appointments) {
        throw new Error("No appointments found in the response")
      }

      const filteredAppointments = response.data.appointments.filter((appointment) => appointment.status === "Pending")

      setAppointments(filteredAppointments)
    } catch (err) {
      setAlertMessage(err.message)
      setAlertType("error")
      setShowAlert(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleCloseAlert = () => {
    setShowAlert(false)
    setAlertMessage(null)
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-blue-600 text-lg">Loading...</div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">
              Medi<span className="text-blue-200">Care</span>
            </h1>
            <p className="text-blue-100 mt-1">Patient Registration & Management</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Alert */}
        {showAlert && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              alertType === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-green-50 border border-green-200 text-green-800"
            }`}
          >
            {alertType === "error" ? (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span>{alertMessage}</span>
            <button onClick={handleCloseAlert} className="ml-auto text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                Register New Patient
              </h2>
            </div>

            <div className="p-6">
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        setPhoto(file || null)
                        if (file) {
                          const url = URL.createObjectURL(file)
                          setPhotoPreview(url)
                        } else {
                          setPhotoPreview(null)
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {photoPreview && (
                      <img
                        src={photoPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-lg border-2 border-blue-100"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NIC</label>
                  <input
                    type="text"
                    placeholder="NIC"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact No</label>
                    <input
                      type="text"
                      placeholder="Contact No"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                  <input
                    type="text"
                    placeholder="Blood Type (e.g., A+, O-, B+)"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  Register Patient
                </button>
              </form>

              {/* QR Scanner Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  Scan Health Card
                </h3>
                <div className="flex items-center justify-center gap-4 p-6 bg-gray-50 rounded-lg">
                  <QrCode size={80} className="text-blue-600" />
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    Scan QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Pending Appointments
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{appointment.patientName}</h4>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Time:</span> {appointment.timeSlot}
                        </p>
                        <p>
                          <span className="font-medium">Doctor:</span> {appointment.doctor}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-500">No pending appointments.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
