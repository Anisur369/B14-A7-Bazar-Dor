'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from "@/assets/logo-icon.png";
import { useSession, signOut } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const dropdownRef = useRef(null);
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  // Dropdown বন্ধ করার লজিক (বাইরে ক্লিক করলে)
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ক্যাটাগরি ফেচ করার লজিক
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.api-store.workers.dev/api/bazardor/categories');
        if (!response.ok) {
          throw new Error('Data fetch failed');
        }
        const resData = await response.json();

        let categoryList = [];
        if (Array.isArray(resData)) {
          categoryList = resData;
        } else if (resData && Array.isArray(resData.categories)) {
          categoryList = resData.categories;
        } else if (resData && typeof resData === 'object') {
          categoryList = Object.values(resData).filter(item => typeof item === 'object' && item !== null && item.slug);
        }

        setCategories(categoryList);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);

      // রিয়্যাক্ট টোস্ট অ্যালার্ট দেখানো
      toast.success('সফলভাবে সাইন আউট হয়েছে।', {
        duration: 3000,
        style: {
          border: '1px solid #f0f0f0',
          padding: '12px 20px',
          color: '#1f2937',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          fontWeight: '500',
          fontSize: '14px',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff',
        },
      });

    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('সাইন আউট করতে সমস্যা হয়েছে!');
    }
  };

  return (
    <header className="w-full bg-[#f8faf7] border-b border-gray-200/70 sticky top-0 z-50 font-sans">

      <Toaster position="top-center" reverseOrder={false} />
      
      {/* ১. মূল নেভবার (Main Navbar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* ব্র্যান্ডিং ও লোগো */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#008744] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 shrink-0 overflow-hidden">
            <Image 
              src={Logo} 
              alt="Logo" 
              width={30} 
              height={30} 
              className="w-50% h-50% object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
              বাজার দর
            </span>
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
              শনিবার, ১০ অক্টোবর, ২০২৬
            </span>
          </div>
        </Link>

        {/* ডান দিকের অংশ: সাইন ইন / সাইন আপ বা প্রোফাইল */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!session && !isPending ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/sign-in"
                className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-emerald-700 transition-colors px-1.5 sm:px-2 py-1"
              >
                সাইন ইন
              </Link>
              <Link
                href="/sign-up"
                className="bg-[#008744] hover:bg-[#007139] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm transition-all"
              >
                সাইন আপ
              </Link>
            </div>
          ) : isPending ? (
            <span className="text-gray-500 text-xs sm:text-sm">Loading...</span>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100/80 transition-colors focus:outline-none"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-gray-200 relative border border-gray-100 shadow-sm shrink-0">
                  <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl font-bold text-slate-700">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 hidden md:inline-block max-w-[120px] truncate">
                  {session?.user?.name}
                </span>
                <FaCaretDown className={`text-xs text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* ড্রপডাউন মেনু */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-[#f8faf7] rounded-2xl shadow-xl border border-gray-200/70 p-3 sm:p-4 z-50">
                  <div className="mb-3 pb-1 border-b border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-snug truncate">
                      {session?.user?.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {session?.user?.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-200/50 rounded-xl transition-colors"
                    >
                      <FaUser className="text-gray-500 text-sm" />
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <FaSignOutAlt className="text-red-500 text-sm rotate-180" />
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ২. ক্যাটাগরি নেভ-লিংকস */}
      <div className="border-t border-gray-200/50 bg-[#f8faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
          {loading ? (
            <div className="flex gap-2 sm:gap-4 py-1">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div key={n} className="h-7 sm:h-8 w-20 sm:w-24 bg-gray-200/80 rounded-lg animate-pulse shrink-0"></div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap py-0.5">
              {categories.map((cat) => {
                const isActive = pathname === `/category/${cat.slug}` || pathname === `/${cat.slug}`;

                return (
                  <Link
                    key={cat.id || cat.slug}
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      isActive
                        ? 'bg-[#008744] text-white shadow-sm'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/60'
                    }`}
                  >
                    <span className="text-sm sm:text-base leading-none">{cat.icon}</span>
                    <span>{cat.nameBn}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </header>
  );
}