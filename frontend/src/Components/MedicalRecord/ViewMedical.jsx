import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../../shared/Sidebar';
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-10 pl-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className='text-[40px] font-bold'>Medi<span className='text-blue-500'>Care</span></h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Medical Records</h2>
          </div>
          <div className="flex mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Medical Records"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)} // Update search term state and filter records
                className="w-full py-2 pl-4 pr-10 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Patient ID</th>
                  <th className="py-3 px-6 text-left">Patient Name</th>
                  <th className="py-3 px-6 text-left">Condition</th>
                  <th className="py-3 px-6 text-left">Symptoms</th>
                  <th className="py-3 px-6 text-left">Lab Tests Results</th>
                  <th className="py-3 px-6 text-left">Treatments</th>
                  <th className="py-3 px-6 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {userMedicalRecords.map((record) => (
                  <tr key={record._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{record.patientID}</td>
                    <td className="py-3 px-6 text-left">{record.patientName}</td>
                    <td className="py-3 px-6 text-left">{record.condition}</td>
                    <td className="py-3 px-6 text-left">{record.symptoms}</td>
                    <td className="py-3 px-6 text-left">{record.labTestResults}</td>
                    <td className="py-3 px-6 text-left">{record.treatments}</td>
                    <td className="py-3 px-6 text-left text-red-500">{record.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedical;
