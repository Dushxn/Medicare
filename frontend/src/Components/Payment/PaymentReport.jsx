// src/Components/PaymentHistory/PaymentReport.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PaymentReport = ({ payment }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(18);
    doc.text('Payment Report', 14, 22);
    doc.setFontSize(12);
    
    // Add table
    const tableData = [
      { label: 'Appointment ID', value: payment.appointmentId._id },
      { label: 'Patient Name', value: payment.appointmentId.patientName },
      { label: 'Email', value: payment.appointmentId.email },
      { label: 'Contact No', value: payment.appointmentId.contactNo },
      { label: 'Specialization', value: payment.appointmentId.specialization },
      { label: 'Doctor', value: payment.appointmentId.doctor },
      { label: 'Date', value: new Date(payment.appointmentId.date).toLocaleDateString() },
      { label: 'Time Slot', value: payment.appointmentId.timeSlot },
      { label: 'Location', value: payment.appointmentId.location },
      { label: 'Status', value: payment.appointmentId.status },
      { label: 'Amount', value: payment.amount },
      { label: 'Payment Date', value: new Date(payment.paymentDate).toLocaleString() },
    ];

    doc.autoTable({
      head: [['Field', 'Value']],
      body: tableData.map(item => [item.label, item.value]),
      startY: 30,
      theme: 'grid',
      styles: {
        cellPadding: 5,
        fontSize: 12,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: '#007bff',
        textColor: '#fff',
      },
      bodyStyles: {
        fillColor: '#f9f9f9',
        textColor: '#333',
      },
      alternateRowStyles: {
        fillColor: '#f1f1f1',
      },
    });

    // Save the PDF
    doc.save(`payment_report_${payment.appointmentId._id}.pdf`);
  };

  return (
    <button onClick={generatePDF} className="text-blue-500">
      Download Report
    </button>
  );
};

export default PaymentReport;
