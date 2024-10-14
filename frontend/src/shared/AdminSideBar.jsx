import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { logout } from '../redux/userSlice'; // Import logout action

const AdminSideSideBar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility on mobile
  const dispatch = useDispatch(); // Initialize dispatch

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    // Optionally, redirect to login page after logout
    window.location.href = '/login';
  };

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger menu for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar} 
          className="text-white bg-blue-600 p-2 rounded-md focus:outline-none"
        >
          {/* Hamburger icon */}
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Sidebar container */}
      <div 
        className={`bg-primaryBlue text-white w-64 h-screen p-4 fixed top-0 lg:top-2 left-0 lg:left-5 z-40 mb-10 rounded-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform lg:translate-x-0`}
      >
        <ul className="space-y-2 text-primaryGray">
          <li>
            <Link 
              to="/adminProfile" 
              className="block px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
              onClick={() => setIsOpen(false)} // Close sidebar on click in mobile
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/adminAppointment" 
              className="block px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Appointments
            </Link>
          </li>
          <li>
            <Link 
              to="/adminMedical" 
              className="block px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Patient Records
            </Link>
          </li>
          <li>
            <Link 
              to="/paymentHistory" 
              className="block px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Staff Schedule
            </Link>
          </li>
          <li>
            <Link 
              to="/paymentHistory" 
              className="block px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              view reports
            </Link>
          </li>
          <li className="block px-4 py-2 rounded hover:bg-red-600 hover:text-white">
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSideSideBar;
