import React from 'react';
import Image from 'next/image';
import bazarHero from '@/assets/bazar-hero.png';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-[#eff3f0] p-4 sm:p-6 md:p-10 flex justify-center items-center font-sans">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 md:p-12 w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex-1 space-y-4 text-left">
          <div className="inline-block bg-[#e1f0e6] text-[#007139] px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            মঙ্গলবার, ৬ অক্টোবর, ২০২৬
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <div className="pt-2">
            <Link
              href="#সব-পণ্য"
              type="button"
              className="bg-[#008744] hover:bg-[#007139] active:scale-[0.98] text-white font-medium px-6 py-2.5 rounded-lg transition-all text-xs sm:text-sm shadow-md"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-end items-center w-full max-w-xs sm:max-w-sm">
          <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px]">
            <Image
              src={bazarHero} 
              width={320}
              height={320}
              alt="ফল ও সবজির ঝুড়ি"
              className="object-contain"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}