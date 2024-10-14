// src/Components/PaymentHistory/PaymentHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PaymentReport from './PaymentReport'; // Import the new PaymentReport component
import Sidebar from '../../shared/Sidebar'; // Adjust the path as necessary

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the userInfo from Redux
  const userInfo = useSelector((state) => state.user.userInfo); // Accessing userInfo
  console.log(userInfo);
  const userId = userInfo?._id; // Accessing userId from userInfo
  console.log(userId);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/payments/history`);
        const filteredPayments = response.data.payments.filter(payment => payment.userId === userId);
        setPayments(filteredPayments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch payment history if userId is available
    if (userId) {
      fetchPaymentHistory();
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      <Sidebar /> {/* Add Sidebar for navigation */}
      <div className="p-5 w-full">
        <h1>Payment History</h1>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Appointment ID</th>
              <th className="border border-gray-300 p-2">Patient Name</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Specialization</th>
              <th className="border border-gray-300 p-2">Doctor</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="border border-gray-300 p-2">{payment.appointmentId._id}</td>
                <td className="border border-gray-300 p-2">{payment.appointmentId.patientName}</td>
                <td className="border border-gray-300 p-2">{new Date(payment.appointmentId.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{payment.appointmentId.specialization}</td>
                <td className="border border-gray-300 p-2">{payment.appointmentId.doctor}</td>
                <td className="border border-gray-300 p-2">{payment.amount}</td>
                <td className="border border-gray-300 p-2">
                  <PaymentReport payment={payment} /> {/* Include PaymentReport component */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
