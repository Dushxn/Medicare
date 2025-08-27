"use client"

import { useEffect, useState } from "react"
import { Search, FileText, Plus } from "lucide-react"
import axios from "axios"
import { Link } from "react-router-dom"

const AdminMedicalRecord = () => {
  const [medicalRecords, setMedicalRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRecords, setFilteredRecords] = useState([])

  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/medical-records/all")
      setMedicalRecords(response.data.records)
      setFilteredRecords(response.data.records)
    } catch (error) {
      console.error("Error fetching medical records:", error)
    }
  }

  useEffect(() => {
    fetchMedicalRecords()
  }, [])

  const handleSearch = () => {
    if (searchTerm) {
      const filtered = medicalRecords.filter((record) =>
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredRecords(filtered)
    } else {
      setFilteredRecords(medicalRecords)
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Medical Records
              </h2>
              <Link to="/createMedical">
                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Record
                </button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Medical Records by Patient Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Condition</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Symptoms</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Lab Tests Results</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Treatments</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{record.patientID}</td>
                      <td className="px-6 py-4 text-gray-600">{record.patientName}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {record.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{record.symptoms}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{record.labTestResults}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{record.treatments}</td>
                      <td className="px-6 py-4 text-blue-600 max-w-xs truncate">{record.notes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      No medical records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMedicalRecord
