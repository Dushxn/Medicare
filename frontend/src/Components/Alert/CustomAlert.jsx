// src/components/CustomAlert.js
import React from 'react';

const CustomAlert = ({ message, type, onClose }) => {
  const alertStyle = type === 'success' ? 'bg-blue-500' : 'bg-red-500';

  return (
    <div className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white ${alertStyle}`}>
      <p>{message}</p>
      <button className="mt-2 text-sm underline" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default CustomAlert
