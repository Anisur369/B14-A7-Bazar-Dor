'use client';
import { FaCaretDown } from 'react-icons/fa';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
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

// ইউনিট রূপান্তর
const getBengaliUnit = (unit) => {
  if (unit === 'kg') return 'প্রতি কেজি';
  if (unit === 'liter' || unit === 'ltr') return 'প্রতি লিটার';
  if (unit === 'dozen') return 'প্রতি ডজন';
  if (unit === 'piece' || unit === 'pcs') return 'প্রতি পিস';
  return `প্রতি ${unit}`;
};

export default function CategoryDetails({ categorySlug = 'chal' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('default'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  console.log(products);

  // 🟢 পেজ লোড বা ক্যাটাগরি পরিবর্তনের সাথে সাথে স্ক্রিন একদম উপরে নিয়ে যাওয়ার জন্য
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(`https://api.api-store.workers.dev/api/bazardor/products?category=${categorySlug}`);
        if (!response.ok) {
          throw new Error('ডেটা ফেচ করতে সমস্যা হয়েছে');
        }
        const resData = await response.json();

        let productList = [];
        if (Array.isArray(resData)) {
          productList = resData;
        } else if (resData && Array.isArray(resData.products)) {
          productList = resData.products;
        } else if (resData && Array.isArray(resData.data)) {
          productList = resData.data;
        } else if (resData && typeof resData === 'object') {
          productList = Object.values(resData).filter(item => typeof item === 'object' && item !== null && item.nameBn);
        }

        setProducts(productList);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('পণ্যের তথ্য লোড করা সম্ভব হয়নি।');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categorySlug]);

  // সর্টিং লজিক
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'low-high') {
      return (a.today || 0) - (b.today || 0);
    } else if (sortBy === 'high-low') {
      return (b.today || 0) - (a.today || 0);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="bg-[#eff3f0] min-h-screen py-10 px-4 flex items-center justify-center font-sans">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#eff3f0] min-h-screen py-10 px-4 font-sans">
        <div className="max-w-6xl mx-auto p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  const categoryName = products.length > 0 ? (products[0].categoryNameBn || 'চাল') : 'চাল';
  const categoryIcon = products.length > 0 ? (products[0].image || products[0].categoryIcon || '🍚') : '🍚';

  return (
    <div className="bg-[#eff3f0] min-h-screen py-6 px-4 sm:px-6 md:px-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shrink-0">
            {categoryIcon}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {toBengaliNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-600">
            মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <div className="relative">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-gray-600 font-medium">সাজান</span>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white border border-gray-300 rounded-lg py-1.5 px-3 flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-all font-medium text-gray-800 focus:outline-none"
              >
                <span>
                  {sortBy === 'default' && 'ডিফল্ট'}
                  {sortBy === 'low-high' && 'দাম: কম থেকে বেশি'}
                  {sortBy === 'high-low' && 'দাম: বেশি থেকে কম'}
                </span>
                <span className="text-[10px]"><FaCaretDown /></span>
              </button>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => { setSortBy('default'); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${sortBy === 'default' ? 'font-semibold text-emerald-600' : 'text-gray-700'}`}
                >
                  <span>ডিফল্ট</span>
                  {sortBy === 'default' && <span>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy('low-high'); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${sortBy === 'low-high' ? 'font-semibold text-emerald-600' : 'text-gray-700'}`}
                >
                  <span>দাম: কম থেকে বেশি</span>
                  {sortBy === 'low-high' && <span>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy('high-low'); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${sortBy === 'high-low' ? 'font-semibold text-emerald-600' : 'text-gray-700'}`}
                >
                  <span>দাম: বেশি থেকে কম</span>
                  {sortBy === 'high-low' && <span>✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedProducts.map((item) => {
            const isUp = item.change?.dir === 'up';
            const isDown = item.change?.dir === 'down';
            const pctVal = Math.abs(item.change?.pct || 0);

            return (
              <Link
                href={`/product/${item.slug}`}
                key={item.id || item.slug}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0">
                    {item.image || item.categoryIcon || '🍚'}
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

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="block text-[11px] text-gray-500 mb-0.5">
                      আজকের দাম
                    </span>
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      {toBengaliNumber(item.today?.toLocaleString('bn-BD'))} <span className="text-xs font-normal">টাকা</span>
                    </div>
                  </div>

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
    </div>
  );
}