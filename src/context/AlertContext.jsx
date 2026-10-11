'use client';

import React, { createContext, useContext, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ show: false, message: '' });

  const showAlert = (message) => {
    setAlert({ show: true, message });

    // ৩.৫ সেকেন্ড পর নিজে থেকেই বন্ধ হয়ে যাবে
    setTimeout(() => {
      setAlert({ show: false, message: '' });
    }, 3500);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* গ্লোবাল অ্যালার্ট পপআপ ডিজাইন */}
      {alert.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] animate-bounce">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3">
            <IoCheckmarkCircle className="text-[#22c55e] text-2xl shrink-0" />
            <span className="text-gray-800 text-sm font-semibold">
              {alert.message}
            </span>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}