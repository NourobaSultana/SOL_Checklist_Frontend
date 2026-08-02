"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardCheck,
  History,
  User,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();

  const { user, logout } = useAuth();

  const menus =
    user?.role === "admin"
      ? [
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Today's Checklist",
            href: "/dashboard/checklist",
            icon: ClipboardCheck,
          },
          {
            title: "History",
            href: "/admin/history",
            icon: History,
          },
          {
            title: "Profile",
            href: "/dashboard/profile",
            icon: User,
          },
        ]
      : [
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Today's Checklist",
            href: "/dashboard/checklist",
            icon: ClipboardCheck,
          },
          {
            title: "History",
            href: "/dashboard/history",
            icon: History,
          },
          {
            title: "Profile",
            href: "/dashboard/profile",
            icon: User,
          },
        ];

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-xl">
      {/* Logo */}
      <div className="border-b border-slate-200 bg-gradient-to-br from-[#7C9E1A] via-[#96B51D] to-[#CDEB4B] px-7 py-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          SOL Checklist
        </h2>

        <p className="mt-1 text-sm text-lime-100">
          Daily Productivity Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-5 py-6">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`group flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-300 ${
                active
                  ? "bg-[#ACC822] text-white shadow-lg"
                  : "text-slate-600 hover:bg-lime-50 hover:text-[#ACC822] hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    active
                      ? "bg-white/20"
                      : "bg-slate-100 group-hover:bg-lime-100"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <span className="font-medium">{menu.title}</span>
              </div>

              {!active && (
                <span className="opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-5">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
