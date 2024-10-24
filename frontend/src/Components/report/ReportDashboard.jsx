import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import AdminSideBar from '../../shared/AdminSideBar'; // Assuming it's already implemented
import axios from 'axios'; // For making API requests
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Chart.js modules
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title } from 'chart.js';

// Register chart modules
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title);

const DataAndReports = () => {
  const [chartData, setChartData] = useState({
    labels: ['8 - 10', '10 - 12', '12 - 14', '14 - 16', '16 - 18'],
    datasets: [
      {
        label: 'Number of Patients',
        data: [0, 0, 0, 0, 0], // Default data
        fill: false,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  });

  // Dummy financial data
  const dummyFinancialData = [
    { appointmentId: '#001', patientId: '#450', patientName: 'Adam Perera', date: '24/02/2024', amount: 6500 },
    { appointmentId: '#002', patientId: '#451', patientName: 'Samantha Silva', date: '24/02/2024', amount: 8000 },
    { appointmentId: '#003', patientId: '#452', patientName: 'John Doe', date: '24/02/2024', amount: 9000 },
    { appointmentId: '#004', patientId: '#453', patientName: 'Alice Smith', date: '24/02/2024', amount: 5000 },
  ];

  const totalAppointments = dummyFinancialData.length;
  const totalIncome = dummyFinancialData.reduce((acc, payment) => acc + payment.amount, 0);
  const totalPatients = new Set(dummyFinancialData.map(payment => payment.patientId)).size;

  // Fetch data from backend API
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/time-slot-analysis');
        const appointments = response.data;
        console.log(appointments);

        // Map time slots to their corresponding labels
        const timeSlotMap = {
          '8:00-10:00AM': 0,
          '10:00-11:00AM': 1,
          '12:00-14:00PM': 2,
          '14:00-16:00PM': 3,
          '16:00-18:00PM': 4,
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

        console.log('Appointment Counts:', appointmentCounts); // Log the counts for debugging

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
        console.error('Error fetching appointment data:', error);
      }
    };

    fetchAppointmentData();
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

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Financial Report', 14, 16);
    doc.autoTable({
      head: [['Appointment ID', 'Patient ID', 'Patient Name', 'Date', 'Amount']],
      body: dummyFinancialData.map(item => [item.appointmentId, item.patientId, item.patientName, item.date, `Rs. ${item.amount}`]),
      startY: 20,
    });
    
    // Adding totals to the PDF
    doc.text(`Total Appointments: ${totalAppointments}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Income: Rs. ${totalIncome}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Total Patients: ${totalPatients}`, 14, doc.lastAutoTable.finalY + 30);

    doc.save('financial_report.pdf');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSideBar />

      <div className="flex-1 p-8 pl-20">
        <h1 className="text-[40px] font-bold text-start">
          Medi<span className="text-blue-500">Care</span>
        </h1>

        {/* Peak Time Analysis Section */}
        <div className="mt-6 flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-2/3">
            <h2 className="text-lg font-semibold mb-4 text-start">Peak Time Analysis</h2>
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Financial Reports Section */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:ml-8">
            <h2 className="text-lg font-semibold mb-4">Financial Reports</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              <p>Total Appointments: <span className="font-semibold">{totalAppointments}</span></p>
              <p>Today's Income: <span className="font-semibold">Rs. {totalIncome}</span></p>
              <p>Total Patient Visits: <span className="font-semibold">{totalPatients}</span></p>
            </div>
            <button 
              onClick={generatePDF} 
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">
              Generate PDF Report
            </button>

            {/* Payment History */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Payment History</h3>
              <div className="space-y-4">
                {dummyFinancialData.map((payment, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
                    <p>Payment ID: <span className="font-semibold">{payment.appointmentId}</span></p>
                    <p>Patient ID: <span className="font-semibold">{payment.patientId}</span></p>
                    <p>Patient Name: <span className="font-semibold">{payment.patientName}</span></p>
                    <p>Appointment ID: <span className="font-semibold">{payment.appointmentId}</span></p>
                    <p>Date: <span className="font-semibold">{payment.date}</span></p>
                    <p>Amount: <span className="font-semibold text-blue-500">Rs. {payment.amount}</span></p>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">
                View Payment History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAndReports;
