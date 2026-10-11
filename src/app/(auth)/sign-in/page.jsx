'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation'; 
import toast from "react-hot-toast";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());
    const password = userData.password;

    // জাভাস্ক্রিপ্ট ভ্যালিডেশন চেক
    if (password.length < 8) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrorMsg('পাসওয়ার্ডে অন্তত একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে।');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setErrorMsg('পাসওয়ার্ডে অন্তত একটি সংখ্যা (0-9) থাকতে হবে।');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signIn.email({
        email: userData.email,
        password: userData.password,
      });
      
      if (error) {
        setErrorMsg(error.message || 'সাইন ইন করতে সমস্যা হয়েছে।');
        setLoading(false);
        return;
      }

      // 🟢 সাইন ইন সফল হলে টোস্ট অ্যালার্ট এবং হোম পেজে রিডাইরেক্ট
      if (data) {
        toast.success('সফলভাবে সাইন ইন হয়েছে।', {
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

        router.push('/');
        router.refresh();
      }

    } catch (err) {
      console.error('Submission Error:', err);
      setErrorMsg('একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }    
  };

  const handleGoogleSignIn = async () => {
    const resData = await signIn.social({
      provider: "google",
      callbackURL: "/", // গুগল সাইন ইন সফল হলে সরাসরি হোমে যাবে
    });
    console.log('after google sign in:', resData);
  };

  const handleGithubSignIn = async () => {
    const resData = await signIn.social({
      provider: "github",
      callbackURL: "/", // গিটহাব সাইন ইন সফল হলে সরাসরি হোমে যাবে
    });
    console.log('after github sign in:', resData);
  };

  return (
    <div className="min-h-screen bg-[#eff3f0] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans text-gray-800">
      <div className="text-center mb-6 max-w-sm sm:max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          সাইন ইন
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 w-full max-w-sm sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              ইমেইল
            </label>
            <input
              type="email"
              name="email"
              placeholder="আপনার ইমেইল লিখুন"
              className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              name="password"
              minLength={8}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all placeholder-gray-400"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#008744] hover:bg-[#007139] active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-lg transition-all text-xs sm:text-sm shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>অপেক্ষা করুন...</span>
              </>
            ) : (
              <span>সাইন ইন</span>
            )}
          </button>
        </form>

        <div className="relative my-5 sm:my-6 flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-3 text-xs text-gray-500 absolute">অথবা</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 px-2.5 text-[11px] sm:text-xs font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors w-full whitespace-nowrap"
          >
            <FcGoogle className="text-base shrink-0" />
            <span>Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 px-2.5 text-[11px] sm:text-xs font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors w-full whitespace-nowrap"
          >
            <FaGithub className="text-base text-gray-900 shrink-0" />
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-gray-600">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
            সাইন আপ করুন
          </Link>
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}