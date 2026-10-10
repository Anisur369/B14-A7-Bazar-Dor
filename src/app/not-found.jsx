import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#eff3f0] flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-gray-800">
      <div className="text-center max-w-md w-full space-y-4">
        
        {/* Mallattoo Guuboo / Shopping Basket Icon */}
        <div className="flex justify-center text-5xl sm:text-6xl mb-2">
          🧺
        </div>

        {/* Mata Duree Fuula Hin Argamne */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          পাতাটি খুঁজে পাওয়া যায়নি
        </h1>

        {/* Ibsa Fuulaa */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-2">
          আপনি যে পণ্য বা পাতাটি খুঁজছেন সেটি সরানো হয়েছে বা কখনো ছিল না।
        </p>

        {/* Qabduuwwan / Buttons */}
        <div className="pt-2 flex flex-row items-center justify-center gap-3">
          {/* Qabduu Gara Fuula Duraa (Home) */}
          <Link
            href="/"
            className="bg-[#008744] hover:bg-[#007139] active:scale-[0.98] text-white font-medium py-2 px-4 sm:px-5 rounded-lg transition-all text-xs sm:text-sm shadow-sm"
          >
            হোম পেজে যান
          </Link>

          {/* Qabduu Wal-maddii Gabaa (Market Comparison) */}
          <Link
            href="/comparison"
            className="bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-800 font-medium py-2 px-4 sm:px-5 rounded-lg border border-gray-300 transition-all text-xs sm:text-sm shadow-sm"
          >
            বাজার তুলনা দেখুন
          </Link>
        </div>

      </div>
    </div>
  );
}