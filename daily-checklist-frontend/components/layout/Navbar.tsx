"use client";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:h-20 sm:px-6 lg:h-24 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        {/* <button className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden">
          <Menu size={22} />
        </button> */}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ACC822] sm:text-sm">
            Dashboard
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification */}
        {/* <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-100">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button> */}

        {/* User */}
        <div className="flex items-center">
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#ACC822] to-lime-500 text-sm font-bold text-white shadow-md sm:h-11 sm:w-11 lg:h-12 lg:w-12">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Name + Email */}
          <div className="ml-3 hidden lg:block">
            <h2 className="max-w-[150px] truncate text-sm font-semibold text-slate-800 xl:max-w-[200px]">
              {user?.name}
            </h2>

            <p className="max-w-[200px] truncate text-xs text-slate-500">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
