'use client';

import React, { useEffect, useState } from 'react';

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

const getBengaliUnit = (unit) => {
  if (unit === 'kg') return 'কেজি';
  if (unit === 'liter' || unit === 'ltr') return 'লিটার';
  if (unit === 'dozen') return 'ডজন';
  if (unit === 'piece' || unit === 'pcs') return 'পিস';
  return unit;
};

export default function PriceTicker() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://openapi.programming-hero.com/api/bazardor/products');
        if (!response.ok) {
          throw new Error('Data fetch failed');
        }
        const data = await response.json();
        const productList = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching ticker products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading || products.length === 0) {
    return (
      <div className="w-full bg-[#f8faf7] border-b border-gray-200/60 py-2.5 overflow-hidden font-sans">
        <div className="text-center text-xs text-gray-400">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8faf7] border-b border-gray-200/60 py-2.5 overflow-hidden font-sans relative">
      <div className="flex overflow-x-hidden whitespace-nowrap">
        {/* Jalqabaa (First Marquee track) */}
        <div className="animate-marquee items-center gap-1 shrink-0 flex">
          {products.map((item, idx) => {
            const isUp = item.change?.dir === 'up';
            const isDown = item.change?.dir === 'down';
            const pctVal = Math.abs(item.change?.pct || 0);

            return (
              <div key={idx} className="flex items-center gap-1 text-xs sm:text-sm shrink-0 px-1">
                <span className="text-base">{item.image || item.categoryIcon || '🍚'}</span>
                <span className="font-bold text-gray-900">{item.nameBn}</span>
                <span className="text-gray-700 font-medium">
                  {toBengaliNumber(item.today)} টাকা/{getBengaliUnit(item.unit)}
                </span>
                <span className={`inline-flex items-center gap-0.5 font-semibold ${isUp ? 'text-red-600' : isDown ? 'text-emerald-600' : 'text-gray-500'}`}>
                  <span>{isUp ? '▲' : isDown ? '▼' : '—'}</span>
                  <span>{toBengaliNumber(pctVal.toFixed(1))}%</span>
                </span>
                <span className="ml-4 text-gray-300">•</span>
              </div>
            );
          })}
        </div>

        {/* Lammaffaa (Duplicate track for infinite scroll effect) */}
        <div className="animate-marquee items-center gap-8 shrink-0 flex" aria-hidden="true">
          {products.map((item, idx) => {
            const isUp = item.change?.dir === 'up';
            const isDown = item.change?.dir === 'down';
            const pctVal = Math.abs(item.change?.pct || 0);

            return (
              <div key={`dup-${idx}`} className="flex items-center gap-2 text-xs sm:text-sm shrink-0 px-4">
                <span className="text-base">{item.image || item.categoryIcon || '🍚'}</span>
                <span className="font-bold text-gray-900">{item.nameBn}</span>
                <span className="text-gray-700 font-medium">
                  {toBengaliNumber(item.today)} টাকা/{getBengaliUnit(item.unit)}
                </span>
                <span className={`inline-flex items-center gap-0.5 font-semibold ${isUp ? 'text-red-600' : isDown ? 'text-emerald-600' : 'text-gray-500'}`}>
                  <span>{isUp ? '▲' : isDown ? '▼' : '—'}</span>
                  <span>{toBengaliNumber(pctVal.toFixed(1))}%</span>
                </span>
                <span className="ml-4 text-gray-300">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}