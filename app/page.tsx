"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo / Brand */}
        <div className="mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#96b51d] shadow-lg shadow-[#96b51d]/30">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Sol-Checklist
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your projects, clients, and analytics — all in one place.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
          <p className="mb-6 text-sm text-gray-500">
            Get started by signing in or creating a new account
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full rounded-xl bg-[#96b51d] py-3 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#84a018] focus:outline-none focus:ring-2 focus:ring-[#96b51d] focus:ring-offset-2"
            >
              Login to your account
            </Link>

            <Link
              href="/register"
              className="block w-full rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:border-[#96b51d] hover:text-[#96b51d] focus:outline-none focus:ring-2 focus:ring-[#96b51d] focus:ring-offset-2"
            >
              Create a new account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Solutya Pvt. Ltd. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
