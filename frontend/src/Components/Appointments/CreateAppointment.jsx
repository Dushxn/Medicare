"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Stethoscope,
  UserCheck,
} from "lucide-react";

const CreateAppointment = () => {
  const userInfo = useSelector((state) => state.user?.userInfo);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: userInfo?.name || "",
    email: userInfo?.email || "",
    contactNo: "",
    specialization: "",
    doctor: "",
    date: "",
    timeSlot: "",
    location: "",
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [phoneError, setPhoneError] = useState("");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("date-input");
    if (dateInput) {
      dateInput.min = today;
    }
  }, []);

  // Keep form in sync with logged-in user
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      patientName: userInfo?.name || prev.patientName || "",
      email: userInfo?.email || prev.email || "",
    }));
  }, [userInfo]);

  // Fetch appointments for quick stats
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/appointments/all"
        );
        const all = Array.isArray(res.data?.appointments)
          ? res.data.appointments
          : [];
        // Filter for logged-in user's email if available
        const mine = userInfo?.email
          ? all.filter((a) => a.email === userInfo.email)
          : all;
        setAppointments(mine);
      } catch (e) {
        console.error(
          "[CreateAppointment] Failed to load appointments:",
          e?.message || e
        );
      }
    };
    fetchAppointments();
  }, [userInfo?.email]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const now = new Date();
    const thisMonth = appointments.filter((a) => {
      const d = new Date(a.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;
    const upcoming = appointments.filter(
      (a) => a.status !== "completed"
    ).length;
    return { total, thisMonth, upcoming };
  }, [appointments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNo") {
      const sanitizedValue = value.replace(/\D/g, "");
      const trimmedValue = sanitizedValue.slice(0, 10);
      setFormData({ ...formData, [name]: trimmedValue });
      if (trimmedValue.length === 10) {
        setPhoneError("");
      } else if (trimmedValue.length > 0) {
        setPhoneError("Please enter a 10-digit phone number");
      } else {
        setPhoneError("");
      }
    } else if (name === "date") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setAlert({
          show: true,
          message: "Please select today or a future date.",
          type: "error",
        });
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        setAlert({ show: false });
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contactNo.length !== 10) {
      setAlert({
        show: true,
        message: "Please enter a valid 10-digit phone number.",
        type: "error",
      });
      return;
    }

    console.log("Appointment data:", formData);
    setAlert({
      show: true,
      message: "Appointment created successfully!",
      type: "success",
    });
  };

  const goToOngoing = () => {
    navigate("/allAppointments", { state: { filter: "ongoing" } });
  };

  const goToHistory = () => {
    navigate("/allAppointments", { state: { filter: "history" } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Medi<span className="text-blue-200">Care</span>
          </h1>
          <p className="text-blue-100">Schedule your appointment with ease</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Book New Appointment
                </h2>
                <div className="space-y-2 text-blue-100">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Patient: {formData.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-center">@</span>
                    <span>Email: {formData.email}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNo"
                      placeholder="Enter 10-digit phone number"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-slate-50 focus:bg-white"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4">⚠</span>
                        {phoneError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-slate-50 focus:bg-white"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Choose specialization
                      </option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="pediatrics">Pediatrics</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Doctor
                    </label>
                    <select
                      name="doctor"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-slate-50 focus:bg-white"
                      value={formData.doctor}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select doctor
                      </option>
                      <option value="dr-jones">Dr. Sarah Jones</option>
                      <option value="dr-smith">Dr. Michael Smith</option>
                      <option value="dr-wilson">Dr. Emily Wilson</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      id="date-input"
                      name="date"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-slate-50 focus:bg-white"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Time Slot
                    </label>
                    <select
                      name="timeSlot"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-slate-50 focus:bg-white"
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Choose time slot
                      </option>
                      <option value="8:00-10:00AM">8:00 - 10:00 AM</option>
                      <option value="10:00-11:00AM">10:00 - 11:00 AM</option>
                      <option value="12:00-14:00PM">12:00 - 2:00 PM</option>
                      <option value="14:00-16:00PM">2:00 - 4:00 PM</option>
                      <option value="16:00-18:00PM">4:00 - 6:00 PM</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Location
                    </label>
                    <select
                      name="location"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-slate-50 focus:bg-white"
                      value={formData.location}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select clinic location
                      </option>
                      <option value="clinic-a">Downtown Medical Center</option>
                      <option value="clinic-b">Westside Health Clinic</option>
                      <option value="clinic-c">Northpoint Medical Plaza</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
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

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">
                Quick Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Total Appointments</span>
                  <span className="font-bold text-blue-800">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">This Month</span>
                  <span className="font-bold text-blue-800">
                    {stats.thisMonth}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Upcoming</span>
                  <span className="font-bold text-blue-800">
                    {stats.upcoming}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {alert.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border-l-4 ${
              alert.type === "error"
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-green-50 border-green-500 text-green-800"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{alert.message}</span>
              <button
                onClick={() => setAlert({ show: false })}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAppointment;
