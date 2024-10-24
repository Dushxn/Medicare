import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSideSideBar from '../../../shared/AdminSideBar';
import CustomAlert from '../../Alert/CustomAlert';

const AddMedicalRecordPage = () => {
  const [alert, setAlert] = useState(null); // Control the alert visibility
  const [formData, setFormData] = useState({
    patientID: '',
    patientName: '',
    condition: '',
    symptoms: '',
    labTestResults: '',
    treatments: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { patientID, patientName, condition, symptoms, labTestResults, treatments, notes } = formData;
    if (!patientID || !patientName || !condition || !symptoms || !labTestResults || !treatments || !notes) {
      setAlert({ type: 'error', message: 'All fields are required' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/medical-records/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({ type: 'success', message: 'Medical record created successfully!' });
        setFormData({
          patientID: '',
          patientName: '',
          condition: '',
          symptoms: '',
          labTestResults: '',
          treatments: '',
          notes: '',
        });
      } else {
        setAlert({ type: 'error', message: result.message || 'Failed to create medical record.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Server error. Please try again later.' });
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSideSideBar />
      <div className="flex-1 p-10 pl-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className='text-[40px] font-bold'>Medi<span className='text-blue-500'>Care</span></h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Add Medical Record</h2>
            <Link to="/adminMedical">
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                Back to Records
              </button>
            </Link>
          </div>

          {alert && (
            <CustomAlert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)} // Clear alert when close button is clicked
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full py-2 px-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Add Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecordPage;
