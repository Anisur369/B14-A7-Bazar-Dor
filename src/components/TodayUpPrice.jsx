'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// Lakkoofsa Ingiliffaa gara Afaan Bangaaliitti jijjiiruuf
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

// Unit gara Bangaaliitti jijjiiruuf
const getBengaliUnit = (unit) => {
  if (unit === 'kg') return 'প্রতি কেজি';
  if (unit === 'liter' || unit === 'ltr') return 'প্রতি লিটার';
  if (unit === 'dozen') return 'প্রতি ডজন';
  if (unit === 'piece' || unit === 'pcs') return 'প্রতি পিস';
  return `প্রতি ${unit}`;
};

export default function TodayUpPrice() {
  const [upProducts, setUpProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpProducts = async () => {
      try {
        const response = await fetch('https://openapi.programming-hero.com/api/bazardor/products');
        if (!response.ok) {
          throw new Error('Data fetch gochuun hin danda amne');
        }
        const data = await response.json();
        const allProducts = Array.isArray(data) ? data : data.products || [];

        // Oomishaalee gatiin isaanii dabalame (change.dir === 'up') calaluu
        const filteredProducts = allProducts.filter(
          (item) => item.change && item.change.dir === 'up'
        );

        setUpProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Oomishaalee dhiheessuun hin danda\'amne.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#eff3f0] py-6 px-4 sm:px-8 font-sans">
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[150px] text-gray-600 text-sm">
          <svg className="animate-spin h-5 w-5 mr-2 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      </section>
    );
  }

  if (error || upProducts.length === 0) {
    return null; // Yoomuu rakkoon jiraate ykn oomishni dabalame dhabamnaan seksiiniin hin mul'atu
  }

  return (
    <section className="bg-[#eff3f0] py-6 px-4 sm:px-6 md:px-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Mata Duree Section */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-red-600 text-sm sm:text-base">▲</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            আজ দাম বেড়েছে
          </h2>
        </div>

        {/* Oomishaalee Gatiin Dabalame Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {upProducts.map((item) => {
            const pctVal = Math.abs(item.change?.pct || 0);

            return (
              <Link
                href={`/product/${item.slug}`}
                key={item.id || item.slug}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Boqonnaa Ol'aanaa: Mallattoo, Maqaa fi Unit */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0">
                    {item.image || item.categoryIcon || '📦'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                      {item.nameBn}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {getBengaliUnit(item.unit)}
                    </p>
                  </div>
                </div>

                {/* Boqonnaa Jalaa: Gatii Har'aa fi Dabalata Dhibbeentaa */}
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="block text-[11px] text-gray-500 mb-0.5">
                      আজকের দাম
                    </span>
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      {toBengaliNumber(item.today?.toLocaleString('bn-BD'))} <span className="text-xs font-normal">টাকা</span>
                    </div>
                  </div>

                  {/* Red Badge Dabalata Gatiif */}
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-600">
                    <span>▲</span>
                    <span>{toBengaliNumber(pctVal.toFixed(1))}%</span>
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