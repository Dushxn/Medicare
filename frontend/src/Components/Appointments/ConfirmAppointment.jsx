import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../shared/Sidebar';
import CustomAlert from '../../Components/Alert/CustomAlert';
import { useSelector } from 'react-redux'; // Importing useSelector from Redux

const ConfirmAppointment = () => {
  const location = useLocation();
  const appointment = location.state?.appointment.appointment || {};
  const navigate = useNavigate();

  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Get userInfo from Redux store
  const userInfo = useSelector((state) => state.user.userInfo); // Get user info from the user slice
  const userId = userInfo?._id; // Extract userId from userInfo, assuming it has an id field

  const handleConfirmAndPay = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/payments/create', {
        appointmentId: appointment._id, // Pass appointment ID to payment API
        userId: userId, // Pass userId to payment API
      });
      console.log('Payment created successfully:', response.data);

      setAlert({
        show: true,
        message: 'Payment created successfully!',
        type: 'success'
      });

      // Optionally, redirect after success
      navigate('/payment-history');

    } catch (error) {
      console.error('Error creating payment:', error);
      setAlert({
        show: true,
        message: 'Error creating payment. Please try again later.',
        type: 'error'
      });
    }
  };

  const handleNavigation = (path) => {
    navigate(path); // Function to navigate to the specified path
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar />

      <div className="p-4 lg:pl-10 lg:flex w-full lg:gap-x-96">
        <div className="w-full lg:w-auto flex flex-col items-start lg:pl-20">
          <h1 className="text-[32px] lg:text-[40px] font-bold mb-6 lg:mb-8">
            Medi<span className="text-blue-500">Care</span>
          </h1>
          <div className="mb-4 text-sm lg:text-base">
            <p className="text-gray-500">Patient Name: {appointment.patientName}</p>
            <p className="text-gray-500">Email: {appointment.email}</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              name="contactNo"
              className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
              value={appointment.contactNo}
              readOnly
            />
            <input
              type="text"
              name="specialization"
              className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
              value={appointment.specialization}
              readOnly
            />
            <input
              type="text"
              name="doctor"
              className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
              value={appointment.doctor}
              readOnly
            />
            <input
              type="text"
              name="date"
              className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
              value={new Date(appointment.date).toLocaleDateString()} // Formatting the date to a readable format
              readOnly
            />
            <input
              type="text"
              name="timeSlot"
              className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
              value={appointment.timeSlot}
              readOnly
            />
            <input
              type="text"
              name="location"
              className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
              value={appointment.location}
              readOnly
            />
          </div>

          <div className="mt-6">
            <button
              onClick={handleConfirmAndPay}
              className="w-full lg:w-96 bg-blue-500 text-white py-2 rounded"
            >
              Confirm and Pay
            </button>
          </div>
        </div>

        <div className="mt-10 lg:mt-0 lg:ml-20">
          <h2 className="text-gray-500 mb-4">Manage Appointments</h2>
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => handleNavigation('/allAppointments')} 
              className="w-full lg:w-60 bg-blue-500 text-white py-2 rounded"
            >
              Ongoing Appointments
            </button>
            <button 
              onClick={() => handleNavigation('/allAppointments')} 
              className="w-full lg:w-60 bg-blue-500 text-white py-2 rounded"
            >
              Appointment History
            </button>
          </div>
        </div>
      </div>

      {/* Display custom alert if needed */}
      {alert.show && (
        <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false })} />
      )}
    </div>
  );
};

export default ConfirmAppointment;
