"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FileText, ArrowLeft, Save, AlertCircle, CheckCircle } from "lucide-react"

const AddMedicalRecordPage = () => {
  const [alert, setAlert] = useState(null)
  const [formData, setFormData] = useState({
    patientID: "",
    patientName: "",
    condition: "",
    symptoms: "",
    labTestResults: "",
    treatments: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const { patientID, patientName, condition, symptoms, labTestResults, treatments, notes } = formData
    if (!patientID || !patientName || !condition || !symptoms || !labTestResults || !treatments || !notes) {
      setAlert({ type: "error", message: "All fields are required" })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await fetch("http://localhost:5000/api/medical-records/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setAlert({ type: "success", message: "Medical record created successfully!" })
        setFormData({
          patientID: "",
          patientName: "",
          condition: "",
          symptoms: "",
          labTestResults: "",
          treatments: "",
          notes: "",
        })
      } else {
        setAlert({ type: "error", message: result.message || "Failed to create medical record." })
      }
    } catch (error) {
      setAlert({ type: "error", message: "Server error. Please try again later." })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">
              Medi<span className="text-blue-200">Care</span>
            </h1>
            <p className="text-blue-100 mt-1">Medical Records Management</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Add Medical Record
              </h2>
              <Link to="/adminMedical">
                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Records
                </button>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Alert */}
            {alert && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  alert.type === "error"
                    ? "bg-red-50 border border-red-200 text-red-800"
                    : "bg-green-50 border border-green-200 text-green-800"
                }`}
              >
                {alert.type === "error" ? (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <span>{alert.message}</span>
                <button onClick={() => setAlert(null)} className="ml-auto text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <input
                    type="text"
                    name="patientID"
                    value={formData.patientID}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter medical condition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe symptoms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Test Results</label>
                <textarea
                  name="labTestResults"
                  value={formData.labTestResults}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lab test results"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatments</label>
                <textarea
                  name="treatments"
                  value={formData.treatments}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter treatments prescribed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="h-4 w-4" />
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMedicalRecordPage
