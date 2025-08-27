import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

const ViewMedical = () => {
  const [medicalRecords, setMedicalRecords] = useState([]); // State to hold fetched medical records
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search input
  const [filteredRecords, setFilteredRecords] = useState([]); // State for filtered records

  // Get user info from Redux store
  const userInfo = useSelector((state) => state.user.userInfo);

  // Fetch medical records from the database
  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medical-records/all'); // Adjust the URL if needed
      setMedicalRecords(response.data.records);
      setFilteredRecords(response.data.records); // Initialize filtered records
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  // Search functionality
  const handleSearch = (term) => {
    setSearchTerm(term); // Update search term state

    if (term) {
      const filtered = medicalRecords.filter((record) =>
        record.patientName.toLowerCase().includes(term.toLowerCase()) ||
        record.patientID.toString().includes(term) || // Include search by patient ID
        record.symptoms.toLowerCase().includes(term.toLowerCase()) // Include search by symptoms
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(medicalRecords); // Reset to all records if search term is empty
    }
  };

  // Filter records based on logged-in user
  const userMedicalRecords = filteredRecords.filter(
    (record) => record.patientName === userInfo.name // Adjust based on how the patient's name is stored
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Page header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Medi<span className="text-blue-200">Care</span>
          </h1>
          <p className="text-blue-100">Browse your medical records</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Medical Records</h2>
          </div>
          <div className="p-6">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search Medical Records"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-slate-50 focus:bg-white"
              />
              <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-slate-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-700">
                    <th className="py-3 px-4">Patient ID</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Symptoms</th>
                    <th className="py-3 px-4">Lab Tests Results</th>
                    <th className="py-3 px-4">Treatments</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {userMedicalRecords.map((record) => (
                    <tr key={record._id} className="border-t last:border-b-0 hover:bg-slate-50/60">
                      <td className="py-3 px-4 whitespace-nowrap">{record.patientID}</td>
                      <td className="py-3 px-4">{record.patientName}</td>
                      <td className="py-3 px-4">{record.condition}</td>
                      <td className="py-3 px-4">{record.symptoms}</td>
                      <td className="py-3 px-4">{record.labTestResults}</td>
                      <td className="py-3 px-4">{record.treatments}</td>
                      <td className="py-3 px-4 text-red-500">{record.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedical;
