"use client";

import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios"; // For making API requests
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

// Chart.js modules
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from "chart.js";

// Register chart modules
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title);

const DataAndReports = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({
    labels: ["8 - 10", "10 - 12", "12 - 14", "14 - 16", "16 - 18"],
    datasets: [
      {
        label: "Number of Patients",
        data: [0, 0, 0, 0, 0], // Default data
        fill: false,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  });
  // Payments state (real-time data)
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState("");

  // Derived payments data
  const validPayments = useMemo(
    () => payments.filter((p) => p.appointmentId !== null),
    [payments]
  );
  const totalAppointments = validPayments.length;
  const totalIncomeAll = useMemo(
    () => validPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [validPayments]
  );
  const totalIncomeToday = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    return validPayments.reduce((sum, p) => {
      const dt = p.paymentDate ? new Date(p.paymentDate) : null;
      if (
        dt &&
        dt.getFullYear() === y &&
        dt.getMonth() === m &&
        dt.getDate() === d
      ) {
        return sum + (Number(p.amount) || 0);
      }
      return sum;
    }, 0);
  }, [validPayments]);
  const totalPatients = useMemo(
    () => new Set(validPayments.map((p) => String(p.userId))).size,
    [validPayments]
  );

  // Fetch data from backend API
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appointments/time-slot-analysis"
        );
        const appointments = response.data;
        console.log(appointments);

        // Map time slots to their corresponding labels
        const timeSlotMap = {
          "8:00-10:00AM": 0,
          "10:00-11:00AM": 1,
          "12:00-14:00PM": 2,
          "14:00-16:00PM": 3,
          "16:00-18:00PM": 4,
        };

        // Create an array to store appointment counts
        const appointmentCounts = [0, 0, 0, 0, 0];

        // Fill the appointment counts based on the timeSlot
        appointments.forEach((appointment) => {
          const index = timeSlotMap[appointment._id]; // Match _id to time slots
          if (index !== undefined) {
            appointmentCounts[index] = appointment.count; // Reflect the count
          }
        });

        console.log("Appointment Counts:", appointmentCounts); // Log the counts for debugging

        // Update chart data
        setChartData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: appointmentCounts,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    fetchAppointmentData();
  }, []);

  // Fetch payments (financial overview + history)
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setPaymentsLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/payments/history"
        );
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPaymentsError("Failed to load payments");
      } finally {
        setPaymentsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0, // Ensure minimum is zero
        max: Math.max(...chartData.datasets[0].data) + 10, // Set max based on data
      },
    },
  };

  // Function to generate PDF report (uses real payments)
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Report", 14, 16);
    doc.autoTable({
      head: [["Appointment ID", "Patient Name", "Date", "Amount (Rs.)"]],
      body: validPayments.map((p) => [
        p.appointmentId?._id ?? "-",
        p.appointmentId?.patientName ?? "-",
        p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "-",
        (Number(p.amount) || 0).toLocaleString(),
      ]),
      startY: 20,
    });

    // Adding totals to the PDF
    doc.text(
      `Paid Appointments: ${totalAppointments}`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Total Income: Rs. ${totalIncomeAll.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `Total Patients: ${totalPatients}`,
      14,
      doc.lastAutoTable.finalY + 30
    );

    doc.save("financial_report.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content - Full Width */}
      <div className="w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Medi<span className="text-blue-200">Care</span>
              </h1>
              <p className="text-blue-100 mt-1">
                Data Analytics & Financial Reports
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Analytics Dashboard</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Peak Time Analysis Section */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 11-18 0 2 2 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Peak Time Analysis
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Patient appointment patterns throughout the day
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Reports Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      Financial Overview
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {paymentsLoading && (
                    <div className="text-slate-600">
                      Loading financial overview...
                    </div>
                  )}
                  {paymentsError && !paymentsLoading && (
                    <div className="text-red-600">{paymentsError}</div>
                  )}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          Paid Appointments
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {totalAppointments}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Today's Income</p>
                        <p className="text-2xl font-bold text-green-600">
                          Rs. {totalIncomeToday.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total Patients</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {totalPatients}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={generatePDF}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Generate PDF Report</span>
                  </button>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Payment History
                    </h3>
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {paymentsLoading && (
                      <div className="text-slate-600">
                        Loading payment history...
                      </div>
                    )}
                    {paymentsError && !paymentsLoading && (
                      <div className="text-red-600">{paymentsError}</div>
                    )}
                    {!paymentsLoading &&
                      !paymentsError &&
                      validPayments.length === 0 && (
                        <div className="text-slate-500">No payments found.</div>
                      )}
                    {!paymentsLoading &&
                      !paymentsError &&
                      validPayments.map((p) => (
                        <div
                          key={p._id}
                          className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {(p.appointmentId?.patientName || "?").charAt(
                                    0
                                  )}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {p.appointmentId?.patientName || "-"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Appointment ID: {p.appointmentId?._id || "-"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                Rs. {(Number(p.amount) || 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-slate-500">
                                {p.paymentDate
                                  ? new Date(p.paymentDate).toLocaleDateString()
                                  : "-"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Status: {p.status || "Paid"}</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Completed
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => navigate("/paymentHistory")}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>View Complete History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAndReports;
