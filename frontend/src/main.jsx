import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Login from "./Components/Login/Login.jsx";
import SignUp from "./Components/Login/SignUp.jsx";
import PatientProfile from "./Components/Profile/PatientProfile.jsx";
import CreateAppointment from "./Components/Appointments/CreateAppointment.jsx";
import ConfirmAppointment from "./Components/Appointments/ConfirmAppointment.jsx";
import AllAppointment from "./Components/Appointments/AllAppointment.jsx";
import PaymentHistory from "./Components/Payment/paymentHistory.jsx";
import AdminProfile from "./Components/Profile/AdminProfile.jsx";
import AdminPatients from "./Components/Profile/AdminPatients.jsx";
import AppointmentControl from "./Components/Appointments/Admin/AppointmentControl.jsx";
import AdminMedicalRecord from "./Components/MedicalRecord/Admin/AdminViewMedical.jsx";
import StaffSchedule from "./Components/StaffSchedule/StaffSchedule.jsx";
import DataAndReports from "./Components/report/ReportDashboard.jsx";
import ViewMedical from "./Components/MedicalRecord/ViewMedical.jsx";
import AddMedicalRecordPage from "./Components/MedicalRecord/Admin/AddMedical.jsx";
import { Sidebar } from "lucide-react";
import Navbar from "./shared/Navbar.jsx";
import PredictionForm from "./Components/Features/Diabetic/PredictionForm.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/patientprofile" element={<PatientProfile />} />
          <Route path="/createAppointment" element={<CreateAppointment />} />
          <Route path="/confirm-appointment" element={<ConfirmAppointment />} />
          <Route path="/allAppointments" element={<AllAppointment />} />
          <Route path="/paymentHistory" element={<PaymentHistory />} />
          <Route path="/adminProfile" element={<AdminProfile />} />
          <Route path="/adminPatients" element={<AdminPatients />} />
          <Route path="/adminAppointment" element={<AppointmentControl />} />
          <Route path="/adminMedical" element={<AdminMedicalRecord />} />
          <Route path="/staffschedule" element={<StaffSchedule />} />
          <Route path="/reportdashboard" element={<DataAndReports />} />
          <Route path="/patientmedical" element={<ViewMedical />} />
          <Route path="/createMedical" element={<AddMedicalRecordPage />} />
          <Route path="/diabeticPrediction" element={<PredictionForm />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>
);
