import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read user object from redux (persisted in localStorage by userSlice)
  // Always call hooks unconditionally to preserve hook order
  const userInfo = useSelector((state) => state.user?.userInfo);
  const userFallback = useSelector((state) => state.user?.user);
  const authUser = useSelector((state) => state.auth?.user);
  const currentUser = userInfo ?? userFallback ?? authUser ?? null;

  const role = useMemo(() => {
    if (!currentUser) return null;
    const raw = currentUser.userType || currentUser.role || "";
    const ut = String(raw).trim().toLowerCase();
    if (ut === "admin") return "admin";
    if (ut === "user" || ut === "patient") return "user";
    if (currentUser.isAdmin) return "admin";
    return "user";
  }, [currentUser]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = useMemo(() => {
    if (role === "admin") {
      return [
        { to: "/adminProfile", label: "Dashboard" },
        { to: "/adminPatients", label: "Patients" },
        { to: "/adminAppointment", label: "Appointments" },
        { to: "/adminMedical", label: "Patient Records" },
        { to: "/staffschedule", label: "Staff Schedule" },
        { to: "/reportdashboard", label: "view reports" },
      ];
    }
    if (role === "user") {
      return [
        { to: "/patientprofile", label: "My Health Card" },
        { to: "/createAppointment", label: "Appointments" },
        { to: "/patientmedical", label: "Medical Records" },
        { to: "/paymentHistory", label: "Payments" },
      ];
    }
    return [];
  }, [role]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full text-black font-semibold px-4 py-3 bg-white/30 backdrop-blur-md backdrop-saturate-150 border-b border-white/20 shadow-sm">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-bold">
            Medi<span className="text-blue-500">Care</span>
          </Link>

          <div className="flex gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded transition-colors duration-200 ease-in-out hover:bg-blue-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            {role ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded transition-colors duration-200 ease-in-out hover:bg-black hover:text-white"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="px-3 py-2 rounded hover:bg-blue-600">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to offset fixed navbar height */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
