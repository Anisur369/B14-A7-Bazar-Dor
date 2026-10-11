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

// ইউনিট রূপান্তর
const getBengaliUnit = (unit) => {
  if (unit === 'kg') return 'প্রতি কেজি';
  if (unit === 'liter' || unit === 'ltr') return 'প্রতি লিটার';
  if (unit === 'dozen') return 'প্রতি ডজন';
  if (unit === 'piece' || unit === 'pcs') return 'প্রতি পিস';
  return `প্রতি ${unit}`;
};

export default function ProductDetails({ slug }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // পেজ লোড হওয়ার সাথে সাথে স্ক্রিন উপরে নিয়ে যাওয়া
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchProductDetails = async () => {
      try {
        const response = await fetch('https://openapi.programming-hero.com/api/bazardor/products');
        if (!response.ok) {
          throw new Error('ডেটা ফেচ করতে সমস্যা হয়েছে');
        }
        const data = await response.json();
        
        // API থেকে আসা ডেটা অ্যারে বা অবজেক্ট হতে পারে, তা হ্যান্ডেল করা
        const productList = Array.isArray(data) ? data : data.products || data.data || [];

        // প্রপস হিসেবে আসা slug এর সাথে মিলে যাওয়া পণ্যটি খুঁজে বের করা
        const matchedProduct = productList.find((item) => item.slug === slug);

        if (matchedProduct) {
          setProduct(matchedProduct);
        } else {
          setError('কাঙ্ক্ষিত পণ্যটি পাওয়া যায়নি।');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('পণ্যের তথ্য লোড করা সম্ভব হয়নি।');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

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

  if (error || !product) {
    return (
      <div className="bg-[#eff3f0] min-h-screen py-10 px-4 font-sans">
        <div className="max-w-4xl mx-auto p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm font-medium">
          {error || 'পণ্য পাওয়া যায়নি।'}
        </div>
      </div>
    );
  }

  // বাজারের সর্বনিম্ন, সর্বাধিক এবং গড় দাম হিসাব করা
  const markets = product.markets || [];
  const minPrices = markets.map((m) => m.min).filter(Boolean);
  const maxPrices = markets.map((m) => m.max).filter(Boolean);

  const minPriceOverall = minPrices.length > 0 ? Math.min(...minPrices) : product.today;
  const maxPriceOverall = maxPrices.length > 0 ? Math.max(...maxPrices) : product.today;
  
  const avgPriceOverall = markets.length > 0
    ? Math.round(markets.reduce((acc, curr) => acc + (curr.min + curr.max) / 2, 0) / markets.length)
    : product.today;

  const diffYesterday = Math.abs((product.today || 0) - (product.yesterday || 0));
  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';
  const pctVal = Math.abs(product.change?.pct || 0);

  return (
    <div className="bg-[#eff3f0] min-h-screen py-6 px-4 sm:px-6 md:px-12 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-5">
        
        <nav className="text-xs text-gray-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-gray-700">হোম</Link>
          <span>›</span>
          <Link href={`/category/${product.category}`} className="hover:text-gray-700">
            {product.categoryNameBn || 'চাল'}
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{product.nameBn}</span>
        </nav>

        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shrink-0">
              {product.image || product.categoryIcon || '🍚'}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {product.nameBn}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {getBengaliUnit(product.unit)} · {product.categoryNameBn || 'চাল'}
              </p>
              
              <p className="text-xs text-gray-500 mt-2">
                গতকালকের তুলনায় আজ দাম{' '}
                <span className={isUp ? 'text-red-600 font-semibold' : isDown ? 'text-emerald-600 font-semibold' : 'font-semibold'}>
                  {isUp ? 'বেড়েছে' : isDown ? 'কমেছে' : 'একই আছে'}
                </span>
                {diffYesterday > 0 && ` · ${toBengaliNumber(diffYesterday)} টাকা`}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100 text-center min-w-[120px] sm:min-w-[140px] self-stretch sm:self-auto flex flex-col justify-center">
            <span className="text-[11px] text-gray-500 block">আজকের দাম</span>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 my-0.5">
              {toBengaliNumber(product.today)}
            </div>
            <span className="text-[10px] text-gray-500 block mb-1">
              টাকা / {product.unit === 'kg' ? 'কেজি' : product.unit}
            </span>
            <div className={`inline-flex items-center justify-center gap-0.5 text-[10px] font-semibold ${isUp ? 'text-red-600' : isDown ? 'text-emerald-600' : 'text-gray-500'}`}>
              <span>{isUp ? '▲' : isDown ? '▼' : '—'}</span>
              <span>{toBengaliNumber(pctVal.toFixed(1))}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm space-y-6">
          
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">
              দামের সারসংক্ষেপ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100">
                <span className="text-xs text-gray-500 block">সর্বনিম্ন দাম</span>
                <div className="text-lg font-bold text-emerald-600 my-1">
                  {toBengaliNumber(minPriceOverall)} টাকা
                </div>
                <span className="text-[11px] text-gray-400 block">সবচেয়ে কম দামের বাজার</span>
              </div>

              <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100">
                <span className="text-xs text-gray-500 block">সর্বাধিক দাম</span>
                <div className="text-lg font-bold text-red-600 my-1">
                  {toBengaliNumber(maxPriceOverall)} টাকা
                </div>
                <span className="text-[11px] text-gray-400 block">সবচেয়ে বেশি দামের বাজার</span>
              </div>

              <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100">
                <span className="text-xs text-gray-500 block">গড় দাম</span>
                <div className="text-lg font-bold text-emerald-600 my-1">
                  {toBengaliNumber(avgPriceOverall)} টাকা
                </div>
                <span className="text-[11px] text-gray-400 block">
                  প্রতি {product.unit === 'kg' ? 'কেজি' : product.unit}-এর হিসাবে
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                    <th className="py-3 px-4 font-semibold">বাজার</th>
                    <th className="py-3 px-4 font-semibold">বিভাগ</th>
                    <th className="py-3 px-4 font-semibold text-center">সর্বনিম্ন</th>
                    <th className="py-3 px-4 font-semibold text-center">সর্বাধিক</th>
                    <th className="py-3 px-4 font-semibold text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {markets.map((m, idx) => {
                    const avg = Math.round((m.min + m.max) / 2);
                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{m.market}</td>
                        <td className="py-3 px-4 text-gray-500">{m.division}</td>
                        <td className="py-3 px-4 text-center">{toBengaliNumber(m.min)} টাকা</td>
                        <td className="py-3 px-4 text-center">{toBengaliNumber(m.max)} টাকা</td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {toBengaliNumber(avg)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}