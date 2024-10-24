import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PaymentReport from './PaymentReport';
import Sidebar from '../../shared/Sidebar';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = useSelector((state) => state.user.userInfo);
  const userId = userInfo?._id;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments/history');
        const filteredPayments = response.data.payments.filter(payment => payment.userId === userId);
        setPayments(filteredPayments);
        
        // Log the filtered payments after setting the state
        console.log('Filtered Payments:', filteredPayments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPaymentHistory();
    }
  }, [userId]);

  // Log payments whenever they change
  useEffect(() => {
    console.log('Payments State Updated:', payments);
  }, [payments]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen ">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 text-center text-xl mt-10">Error: {error}</div>;

  // Filter payments to remove those with null appointmentId
  const validPayments = payments.filter(payment => payment.appointmentId !== null);

  return (
    <div className="flex min-h-screen ml-20">
      <Sidebar />
      <div className="p-8 w-full">
        <h1 className='text-[40px] font-bold text-left mb-5'>Medi<span className='text-blue-500'>Care</span></h1>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-left">Payment History</h1>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {validPayments.map((payment, index) => (
                <tr key={payment._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.appointmentId?._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.appointmentId?.patientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.appointmentId ? new Date(payment.appointmentId.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.appointmentId?.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.appointmentId?.doctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rs.{payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <PaymentReport payment={payment} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
