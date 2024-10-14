import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../shared/Sidebar';
import axios from 'axios';

const PatientProfile = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.userInfo.email); // Adjust based on your Redux setup
  console.log(email)
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
    <>
      <div className='flex'>
        <Sidebar />
        <div className="pl-20 w-full p-6 min-h-screen">
          <h1 className='text-[40px] font-bold mb-4'>
            Medi<span className='text-blue-500'>Care</span>
          </h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {healthCard && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Patient Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold">Name:</h3>
                  <p>{healthCard.firstName} {healthCard.lastName}</p>
                </div>
                <div>
                  <h3 className="font-bold">Email:</h3>
                  <p>{healthCard.email}</p>
                </div>
                <div>
                  <h3 className="font-bold">NIC:</h3>
                  <p>{healthCard.NIC}</p>
                </div>
                <div>
                  <h3 className="font-bold">Gender:</h3>
                  <p>{healthCard.gender}</p>
                </div>
                <div>
                  <h3 className="font-bold">Contact No:</h3>
                  <p>{healthCard.contactNo}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientProfile;
