'use client';

import Link from "next/link";

export default function Home() {


 return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo / Brand */}
        <div className="mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Sol-Checklist
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your projects, clients, and analytics — all in one place.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
          <p className="text-sm text-gray-500 mb-6">
            Get started by signing in or creating a new account
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-95"
            >
              Login to your account
            </Link>

            <Link
              href="/register"
              className="block w-full rounded-xl border border-gray-300 py-3 text-gray-700 font-semibold transition-all duration-300 hover:border-indigo-500 hover:text-indigo-600 hover:scale-[1.02] active:scale-95"
            >
              Create a new account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} Your Sol-Checklist. All rights reserved.
        </p>
      </div>
    </div>
  );
};
