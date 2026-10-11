import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#ffffff] border-b border-gray-300 py-6 px-4 sm:px-8 md:px-16 font-sans border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-gray-800">
        <p className="font-normal text-center sm:text-left">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="font-normal text-center sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}