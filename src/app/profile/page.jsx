"use client";

import { signOut, updateUser, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");

  const handleSignOut = () => {
    signOut();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser({ name });
  };

  return (
    <div className="min-h-screen bg-[#eff2ee] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* User Card */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-200">
              {/* <Image
                src={session?.user?.image || "https://avatars.githubusercontent.com/u/116089301?v=4"}
                alt="Profile"
                fill
                className="object-cover"
              /> */}
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-700">
                {session?.user?.name?.charAt(0).toUpperCase() || ""}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {session?.user?.name}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12"
              />
            </svg>
            সাইন আউট
          </button>
        </div>

        {/* Information Form Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-8">
          <h3 className="mb-6 text-lg font-bold text-slate-900">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                নাম
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#f9fafb] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#008744] focus:bg-white focus:ring-1 focus:ring-[#008744]"
                placeholder=""
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#008744] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-[#008744]/20 transition hover:bg-[#007239] active:scale-[0.99]"
            >
              আপডেট
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}