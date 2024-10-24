import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Sidebar from '../../shared/Sidebar';
import CustomAlert from '../../Components/Alert/CustomAlert';
import { useNavigate } from 'react-router-dom';

const CreateAppointment = () => {
  const { userInfo } = useSelector((state) => state.user);
  const userName = userInfo?.name || '';
  const userEmail = userInfo?.email || '';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: userName,
    email: userEmail,
    contactNo: '',
    specialization: '',
    doctor: '',
    date: '',
    timeSlot: '',
    location: ''
  });

  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    // Set the minimum date to today when the component mounts
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-input').min = today;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contactNo') {
      // Remove any non-digit characters
      const sanitizedValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      const trimmedValue = sanitizedValue.slice(0, 10);
      setFormData({ ...formData, [name]: trimmedValue });
      // Validate phone number
      if (trimmedValue.length === 10) {
        setPhoneError('');
      } else if (trimmedValue.length > 0) {
        setPhoneError('Please enter a 10-digit phone number');
      } else {
        setPhoneError('');
      }
    } else if (name === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setAlert({
          show: true,
          message: 'Please select today or a future date.',
          type: 'error'
        });
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
        setAlert({ show: false });
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contactNo.length !== 10) {
      setAlert({
        show: true,
        message: 'Please enter a valid 10-digit phone number.',
        type: 'error'
      });
      return;
    }

    const appointmentData = {
      patientName: formData.patientName,
      email: formData.email,
      contactNo: formData.contactNo,
      specialization: formData.specialization,
      doctor: formData.doctor,
      date: formData.date,
      timeSlot: formData.timeSlot,
      location: formData.location
    };

    try {
      const response = await axios.post('http://localhost:5000/api/appointments/create', appointmentData);
      console.log('Appointment created successfully:', response.data);
      navigate('/confirm-appointment', { state: { appointment: response.data } });
    } catch (error) {
      console.error('Error creating appointment:', error);
      setAlert({
        show: true,
        message: 'Error creating appointment. Please try again later.',
        type: 'error'
      });
    }
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
            <p className="text-gray-500">Patient Name: {formData.patientName}</p>
            <p className="text-gray-500">Email: {formData.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Enter Contact Number"
                  className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                />
                {phoneError && <p className="text-red-500 mt-1 text-sm">{phoneError}</p>}
              </div>
              <select
                name="specialization"
                className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
                value={formData.specialization}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Specialization</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
              </select>
              <select
                name="doctor"
                className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
                value={formData.doctor}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Doctor</option>
                <option value="dr-jones">Dr. Jones</option>
                <option value="dr-smith">Dr. Smith</option>
              </select>
              <input
                type="date"
                id="date-input"
                name="date"
                className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
                value={formData.date}
                onChange={handleInputChange}
              />
             <select
                name="timeSlot"
                className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
                value={formData.timeSlot}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Time Slot</option>
                <option value="8:00-10:00AM">8:00 - 10:00 AM</option>
                <option value="10:00-11:00AM">10:00 - 11:00 AM</option>
                <option value="12:00-14:00PM">12:00 - 14:00 PM</option>
                <option value="14:00-16:00PM">14:00 - 16:00 PM</option>
                <option value="16:00-18:00PM">16:00 - 18:00 PM</option>
              </select>
              <select
                name="location"
                className="w-full lg:w-96 p-2 border-transparent rounded bg-secondaryGray text-primaryGray"
                value={formData.location}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Location</option>
                <option value="clinic-a">Clinic A</option>
                <option value="clinic-b">Clinic B</option>
              </select>
            </div>
            <div className="mt-6">
              <button type="submit" className="w-full lg:w-96 bg-blue-500 text-white py-2 rounded">
                Proceed
              </button>
            </div>
          </form>
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

      {alert.show && (
        <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false })} />
      )}
    </div>
  );
};

export default CreateAppointment;