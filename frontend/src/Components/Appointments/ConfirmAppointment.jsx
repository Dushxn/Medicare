import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomAlert from "../../Components/Alert/CustomAlert";
import { useSelector } from "react-redux"; // Importing useSelector from Redux

const ConfirmAppointment = () => {
  const location = useLocation();
  const appointment = location.state?.appointment.appointment || {};
  const navigate = useNavigate();

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Get userInfo from Redux store
  const userInfo = useSelector((state) => state.user.userInfo); // Get user info from the user slice
  const userId = userInfo?._id; // Extract userId from userInfo, assuming it has an id field

  const handleConfirmAndPay = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payments/create",
        {
          appointmentId: appointment._id, // Pass appointment ID to payment API
          userId: userId, // Pass userId to payment API
        }
      );
      console.log("Payment created successfully:", response.data);

      setAlert({
        show: true,
        message: "Payment created successfully!",
        type: "success",
      });

      // Optionally, redirect after success
      navigate("/paymentHistory");
    } catch (error) {
      console.error("Error creating payment:", error);
      setAlert({
        show: true,
        message: "Error creating payment. Please try again later.",
        type: "error",
      });
    }
  };

  const goToOngoing = () =>
    navigate("/allAppointments", { state: { filter: "ongoing" } });
  const goToHistory = () =>
    navigate("/allAppointments", { state: { filter: "history" } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Medi<span className="text-blue-200">Care</span>
          </h1>
          <p className="text-blue-100">Confirm your appointment details</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Confirm Appointment
                </h2>
                <div className="space-y-1 text-blue-100">
                  <p>Patient: {appointment.patientName}</p>
                  <p>Email: {appointment.email}</p>
                </div>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Contact Number
                    </label>
                    <div className="mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      {appointment.contactNo}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Specialization
                    </label>
                    <div className="mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      {appointment.specialization}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Doctor
                    </label>
                    <div className="mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      {appointment.doctor}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Appointment Date
                    </label>
                    <div className="mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      {appointment.date
                        ? new Date(appointment.date).toLocaleDateString()
                        : ""}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Time Slot
                    </label>
                    <div className="mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      {appointment.timeSlot}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Location
                    </label>
                    <div className="mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      {appointment.location}
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={handleConfirmAndPay}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Confirm and Pay
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Manage Appointments
              </h3>
              <div className="space-y-4">
                <button
                  onClick={goToOngoing}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                  Ongoing Appointments
                </button>
                <button
                  onClick={goToHistory}
                  className="w-full border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Appointment History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display custom alert if needed */}
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false })}
        />
      )}
    </div>
  );
};

export default ConfirmAppointment;
