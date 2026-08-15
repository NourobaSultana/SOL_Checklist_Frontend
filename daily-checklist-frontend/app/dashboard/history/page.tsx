"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  ClipboardList,
  History,
  CalendarCheck,
  Receipt,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HIstory Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Checklists */}
        <Link
          href={
            user?.role === "admin"
              ? "/admin/history?type=checklist"
              : "/dashboard/history/checklisthistory"
          }
          className="group rounded-2xl border border-[#ACC822]/20 bg-gradient-to-br from-[#F7FCE8] via-[#EEF8C8] to-[#E2F57A] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl sm:p-6 lg:p-7"
        >
          Checklists
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:h-14 sm:w-14 sm:rounded-2xl">
              <ClipboardList size={24} className="sm:h-7 sm:w-7" />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </Link>

        {/* Appointments */}
        <Link
          href={
            user?.role === "admin"
              ? "/admin/history?type=appointment"
              : "/dashboard/history/appointmenthistory"
          }
          className="group rounded-2xl border border-slate-200  bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl sm:rounded-3xl sm:p-6 lg:p-7"
        >
          Appointments
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 sm:h-14 sm:w-14 sm:rounded-2xl">
              <CalendarCheck size={24} className="sm:h-7 sm:w-7" />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </Link>

        {/* Daily Expanses*/}
        <Link
          href={
            user?.role === "admin"
              ? "/admin/history?type=expense"
              : "/dashboard/history/dailyexpansehistory"
          }
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl sm:rounded-3xl sm:p-6 lg:p-7"
        >
          Daily Expanses
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 sm:h-14 sm:w-14 sm:rounded-2xl">
              <Receipt size={24} className="sm:h-7 sm:w-7" />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
