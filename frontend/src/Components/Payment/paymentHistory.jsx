import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PaymentReport from "./PaymentReport";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = useSelector((state) => state.user.userInfo);
  const userId = userInfo?._id;
  const userType = userInfo?.userType;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/payments/history"
        );

        const all = response.data.payments || [];

        // Admin sees all; users see only their own
        let filteredPayments = all;
        if (userType !== "admin") {
          filteredPayments = all.filter((payment) => {
            const pid =
              typeof payment.userId === "object"
                ? payment.userId?._id
                : payment.userId;
            const byId = pid === userId;
            const byEmail =
              payment.appointmentId?.email &&
              payment.appointmentId.email === userInfo?.email;
            return byId || byEmail;
          });
        }

        setPayments(filteredPayments);

        // Log the filtered payments after setting the state
        console.log("Filtered Payments:", filteredPayments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId || userType === "admin") {
      fetchPaymentHistory();
    }
  }, [userId, userType, userInfo?.email]);

  // Log payments whenever they change
  useEffect(() => {
    console.log("Payments State Updated:", payments);
  }, [payments]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center text-slate-600">
        Loading payments...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );

  // Filter payments to remove those with null appointmentId
  const validPayments = payments.filter(
    (payment) => payment.appointmentId !== null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Medi<span className="text-blue-200">Care</span>
          </h1>
          <p className="text-blue-100">Your payment history</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Payment History</h2>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="min-w-full bg-white border border-slate-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-700">
                  <th className="py-3 px-4">Appointment ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {validPayments.map((payment, index) => (
                  <tr
                    key={payment._id}
                    className="border-t last:border-b-0 hover:bg-slate-50/60"
                  >
                    <td className="py-3 px-4">{payment.appointmentId?._id}</td>
                    <td className="py-3 px-4">
                      {payment.appointmentId?.patientName}
                    </td>
                    <td className="py-3 px-4">
                      {payment.appointmentId
                        ? new Date(
                            payment.appointmentId.date
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      {payment.appointmentId?.specialization}
                    </td>
                    <td className="py-3 px-4">
                      {payment.appointmentId?.doctor}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      Rs.{payment.amount}
                    </td>
                    <td className="py-3 px-4">
                      <PaymentReport payment={payment} />
                    </td>
                  </tr>
                ))}
                {validPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 px-4 text-center text-slate-500"
                    >
                      No payments found for your account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
