import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../shared/Sidebar';
import axios from 'axios';
import { UserCircle } from 'lucide-react';

const PatientProfile = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.userInfo.email);
  const [healthCard, setHealthCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthCardDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/health-cards/details/${email}`);
        setHealthCard(response.data.healthCard);
      } catch (err) {
        setError('Failed to fetch health card details');
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchHealthCardDetails();
    }
  }, [email]);

  return (
    <div className='flex bg-gray-100 min-h-screen ml-20 rounded-xl'>
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className='text-4xl font-bold mb-8 text-gray-800 text-left ml-20'>
          Medi<span className='text-blue-500'>Care</span>
        </h1>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {healthCard && (
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <UserCircle className="h-20 w-20 text-blue-500 mr-4" />
              <div>
                <h2 className="text-3xl font-semibold text-gray-800 text-left">Patient Profile</h2>
                <p className="text-gray-500">View and manage your health information</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <ProfileField label="Name" value={`${healthCard.firstName} ${healthCard.lastName}`} />
              <ProfileField label="Email" value={healthCard.email} />
              <ProfileField label="NIC" value={healthCard.NIC} />
              <ProfileField label="Gender" value={healthCard.gender} />
              <ProfileField label="Contact No" value={healthCard.contactNo} />
              <ProfileField label="Blood Type" value={healthCard.bloodType || 'Not specified'} />
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Health Notes</h3>
              <p className="text-gray-700">{healthCard.healthNotes || 'No health notes available.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-gray-500 uppercase">{label}</h3>
    <p className="text-lg text-gray-800">{value}</p>
  </div>
);

export default PatientProfile;