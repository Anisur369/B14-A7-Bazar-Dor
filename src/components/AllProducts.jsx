'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
const toBengaliNumber = (num) => {
  if (num === null || num === undefined) return '';
  const englishToBengaliMap = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
    '.': '.', '-': '-'
  };
  return num
    .toString()
    .split('')
    .map((char) => englishToBengaliMap[char] || char)
    .join('');
};

// কাস্টম ইউনিট রূপান্তর (যেমন: kg -> কেজি, liter -> লিটার)
const getBengaliUnit = (unit) => {
  if (unit === 'kg') return 'প্রতি কেজি';
  if (unit === 'liter' || unit === 'ltr') return 'প্রতি লিটার';
  return `প্রতি ${unit}`;
};

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log('Products:', products); // ডিবাগিং এর জন্য লগ

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.api-store.workers.dev/api/bazardor/products');
        if (!response.ok) {
          throw new Error('ডাটা লোড করতে ব্যর্থ হয়েছে');
        }
        const data = await response.json();
        
        // API থেকে পাওয়া ডাটা সেট করা (যদি সরাসরি অ্যারে আসে অথবা data.products আসে)
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('পণ্যসমূহের তথ্য লোড করা সম্ভব হয়নি।');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#eff3f0] min-h-[400px] p-4 sm:p-8 flex items-center justify-center font-sans">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>পণ্যসমূহ লোড হচ্ছে...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#eff3f0] p-4 sm:p-8 font-sans">
        <div className="max-w-6xl mx-auto p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm font-medium">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#eff3f0] py-8 px-4 sm:px-6 md:px-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* হেডার সেকশন */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {/* প্রোডাক্ট গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((item) => {
            const isUp = item.change?.dir === 'up';
            const isDown = item.change?.dir === 'down';
            const pctVal = Math.abs(item.change?.pct || 0);

            return (
              <Link
                href={`/product/${item.slug}`}
                key={item.id || item.slug}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* কার্ডের উপরের অংশ: আইকন, নাম ও একক */}
                <div className="flex items-start gap-3">
                  {/* আইকন / ইমেজ কন্টেইনার */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0">
                    {item.image || item.categoryIcon || '📦'}
                  </div>

                  {/* নাম এবং ইউনিট */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                      {item.nameBn}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {getBengaliUnit(item.unit)}
                    </p>
                  </div>
                </div>

                {/* কার্ডের নিচের অংশ: দাম এবং পরিবর্তনের পার্সেন্টেজ */}
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="block text-[11px] text-gray-500 mb-0.5">
                      আজকের দাম
                    </span>
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      {toBengaliNumber(item.today?.toLocaleString('bn-BD'))} <span className="text-xs font-normal">টাকা</span>
                    </div>
                  </div>

                  {/* পরিবর্তনের ব্যাজ (Up / Down / Neutral) */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold ${
                      isUp
                        ? 'bg-red-50 text-red-600'
                        : isDown
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span>
                      {isUp ? '▲' : isDown ? '▼' : '—'}
                    </span>
                    <span>
                      {toBengaliNumber(pctVal.toFixed(1))}%
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}