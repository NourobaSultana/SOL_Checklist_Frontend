"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, ClipboardList, History } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#96B51D] via-[#ACC822] to-[#D6EE5B] p-5 text-white shadow-[0_20px_50px_rgba(172,200,34,0.35)] sm:rounded-3xl sm:p-8 lg:p-10">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Welcome Back
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base lg:text-lg">
          Manage your daily checklist, track previous submissions, and stay
          productive with your personalized dashboard.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Today's Checklist */}
        <Link
          href="/dashboard/checklist"
          className="group rounded-2xl border border-[#ACC822]/20 bg-gradient-to-br from-[#F7FCE8] via-[#EEF8C8] to-[#E2F57A] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl sm:p-6 lg:p-7"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:h-14 sm:w-14 sm:rounded-2xl">
              <ClipboardList size={24} className="sm:h-7 sm:w-7" />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-800 sm:text-2xl">
            Today's Checklist
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Complete your daily checklist and keep your progress updated.
          </p>
        </Link>

        {/* History */}
        <Link
          href={
            user?.role === "admin" ? "/admin/history" : "/dashboard/history"
          }
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl sm:rounded-3xl sm:p-6 lg:p-7"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 sm:h-14 sm:w-14 sm:rounded-2xl">
              <History size={24} className="sm:h-7 sm:w-7" />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-800 sm:text-2xl">
            History
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            View, review, and manage all your previous checklist submissions.
          </p>
        </Link>
      </div>
    </div>
  );
}
