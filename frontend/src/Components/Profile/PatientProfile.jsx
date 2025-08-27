"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserCircle,
  Heart,
  Phone,
  Mail,
  User,
  Droplet,
  FileText,
  Wrench,
} from "lucide-react";

const PatientProfile = () => {
  const email = useSelector((state) => state.user?.userInfo?.email);
  const [healthCard, setHealthCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthCardDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/health-cards/details/${email}`
        );
        setHealthCard(response.data.healthCard);
      } catch (err) {
        setError("Failed to fetch health card details");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchHealthCardDetails();
    }
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Page header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Medi<span className="text-blue-200">Care</span>
          </h1>
          <p className="text-blue-100">Your health card and profile</p>
        </div>
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-slate-600">
          <div className="inline-flex items-center gap-3">
            <Heart className="h-5 w-5 animate-pulse text-blue-600" />
            Loading patient information...
          </div>
        </div>
      )}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-6 text-center text-red-700">
            {error}
          </div>
        </div>
      )}

      {!loading && !error && healthCard && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Profile details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {healthCard.firstName} {healthCard.lastName}
                  </h2>
                  <div className="space-y-1 text-blue-100">
                    <p>Email: {healthCard.email}</p>
                    <p>Patient ID: {healthCard.NIC}</p>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field
                      label="Full Name"
                      icon={<User className="w-4 h-4 text-blue-600" />}
                    >
                      {healthCard.firstName} {healthCard.lastName}
                    </Field>
                    <Field
                      label="Email Address"
                      icon={<Mail className="w-4 h-4 text-blue-600" />}
                    >
                      {healthCard.email}
                    </Field>
                    <Field
                      label="National ID"
                      icon={<FileText className="w-4 h-4 text-blue-600" />}
                    >
                      {healthCard.NIC}
                    </Field>
                    <Field
                      label="Gender"
                      icon={<User className="w-4 h-4 text-blue-600" />}
                    >
                      {healthCard.gender}
                    </Field>
                    <Field
                      label="Contact Number"
                      icon={<Phone className="w-4 h-4 text-blue-600" />}
                    >
                      {healthCard.contactNo}
                    </Field>
                    <Field
                      label="Blood Type"
                      icon={<Droplet className="w-4 h-4 text-blue-600" />}
                    >
                      {healthCard?.bloodType || "Not specified"}
                    </Field>
                  </div>
                </div>
              </div>

              {/* Health notes */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mt-8">
                <div className="px-8 py-6 border-b border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Health Notes
                    & Records
                  </h3>
                </div>
                <div className="p-8">
                  <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                    {healthCard.healthNotes ||
                      "No health notes available at this time. Please consult with your healthcare provider to add relevant medical information."}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Profile photo */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  Profile Photo
                </h3>
                {healthCard.photoUrl ? (
                  <img
                    src={`http://localhost:5000${healthCard.photoUrl}`}
                    alt="Profile"
                    className="w-full rounded-xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white">
                    <UserCircle className="h-16 w-16" />
                  </div>
                )}
              </div>

              {/* Tools section */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-600" /> Tools
                </h3>
                <p className="text-slate-600 mb-4">
                  Explore helpful utilities to better understand your health.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/diabeticPrediction")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Diabetes Risk Prediction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, icon, children }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <div className="mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
      {children}
    </div>
  </div>
);

export default PatientProfile;
