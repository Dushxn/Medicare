// src/Components/AdminProfile/AdminProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QrCode } from 'lucide-react';
import Sidebar from '../../shared/Sidebar';
import CustomAlert from '../../components/Alert/CustomAlert'; // Import the CustomAlert component
import AdminSideSideBar from '../../shared/AdminSideBar';

const AdminProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [gender, setGender] = useState('');
  const [contactNo, setContactNo] = useState(''); // Added contactNo state
  const [birthday, setBirthday] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null); // State for alert messages
  const [alertType, setAlertType] = useState('success'); // State for alert type
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

  // Function to register patients
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/health-cards/register', {
        firstName,
        lastName,
        email,
        NIC: nic,
        gender,
        contactNo,
      });
      setAlertMessage(response.data.message); // Set success message from response
      setAlertType('success'); // Set alert type to success
      setShowAlert(true); // Show the alert

      // Reset form fields after successful registration
      setFirstName('');
      setLastName('');
      setEmail('');
      setNic('');
      setGender('');
      setContactNo('');
    } catch (err) {
      setAlertMessage(err.message); // Set error message if any
      setAlertType('error'); // Set alert type to error
      setShowAlert(true); // Show the alert
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments/all');
      console.log(response.data); // Log the entire response

      // Check if appointments exist in the response
      if (!response.data.appointments) {
        throw new Error("No appointments found in the response");
      }

      // Filter appointments based on status
      const filteredAppointments = response.data.appointments.filter((appointment) => {
        return appointment.status === 'Pending'; // Check if the appointment is pending
      });

      console.log(filteredAppointments); // Log filtered appointments
      setAppointments(filteredAppointments); // Set state with filtered appointments
    } catch (err) {
      setAlertMessage(err.message); // Set error message if any
      setAlertType('error'); // Set alert type to error
      setShowAlert(true); // Show the alert
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false); // Hide alert on close
    setAlertMessage(null); // Reset alert message
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <AdminSideSideBar />
      <div className="flex-1 p-10 pl-20">
        {showAlert && (
          <CustomAlert 
            message={alertMessage} 
            type={alertType} 
            onClose={handleCloseAlert} 
          />
        )}
        <div className="flex justify-between items-center mb-8">
          <h1 className='text-[40px] font-bold'>Medi<span className='text-blue-500'>Care</span></h1>
        </div>
        <div className="flex space-x-8">
          <div className="w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-start">Register patients</h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  className="w-1/2 p-2 border rounded" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  className="w-1/2 p-2 border rounded" 
                  required 
                />
              </div>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-2 border rounded" 
                required 
              />
              <input 
                type="text" 
                placeholder="NIC" 
                value={nic} 
                onChange={(e) => setNic(e.target.value)} 
                className="w-full p-2 border rounded" 
                required 
              />
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Gender" 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)} 
                  className="w-1/2 p-2 border rounded" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Contact No" 
                  value={contactNo} 
                  onChange={(e) => setContactNo(e.target.value)} // Added onChange for contactNo
                  className="w-1/2 p-2 border rounded" 
                  required 
                />
              </div>
              
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
            </form>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2 text-start mt-20">Scan Health Card</h3>
              <div className="flex items-center space-x-4">
                <QrCode size={100} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Scan</button>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-semibold mb-4">Pending Appointments</h2>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment._id} className="bg-gray-200 p-4 rounded">
                    <p><strong>Patient Name:</strong> {appointment.patientName}</p>
                    <p><strong>Time Slot:</strong> {appointment.timeSlot}</p>
                    <p><strong>Assigned Doctor:</strong> {appointment.doctor}</p>
                  </div>
                ))
              ) : (
                <p>No pending appointments.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
