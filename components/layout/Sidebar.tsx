"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardCheck,
  ClipboardClock,
  History,
  User,
  LogOut,
  Receipt,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Sidebar() {
  const { dictionary, language, setLanguage } = useLanguage();
  const pathname = usePathname();

  const { user, logout } = useAuth();

  const menus =
    user?.role === "admin"
      ? [
          {
            title: "dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "checklist",
            href: "/dashboard/checklist",
            icon: ClipboardCheck,
          },
          {
            title: "appointment",
            href: "/dashboard/todaysAppointment",
            icon: ClipboardClock,
          },
          {
            title: "expense",
            href: "/dashboard/todaysExpense",
            icon: Receipt,
          },
          {
            title: "history",
            href: "/admin/history",
            icon: History,
          },
          {
            title: "profile",
            href: "/dashboard/profile",
            icon: User,
          },
        ]
      : [
          {
            title: "dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "checklist",
            href: "/dashboard/checklist",
            icon: ClipboardCheck,
          },
          {
            title: "appointment",
            href: "/dashboard/todaysAppointment",
            icon: ClipboardClock,
          },
          {
            title: "expense",
            href: "/dashboard/todaysExpense",
            icon: Receipt,
          },
          {
            title: "history",
            href: "/dashboard/history",
            icon: History,
          },
          {
            title: "profile",
            href: "/dashboard/profile",
            icon: User,
          },
        ];

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col bg-white shadow-xl">
      {/* Logo */}
      <div className="bg-[#ACC822] px-6 py-6 text-white">
        <h1 className="text-2xl font-bold">{dictionary.menu.logo}</h1>

        <p className="mt-1 text-sm text-lime-100">{dictionary.menu.tagline}</p>
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
                  : "text-slate-600 hover:translate-x-1 hover:bg-lime-50 hover:text-[#ACC822]"
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

                <span className="font-medium">
                  {dictionary.menu[menu.title]}
                </span>
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

      {/* Language Button */}
      <div className="px-5 pb-3">
        <button
          type="button"
          onClick={() => setLanguage(language === "en" ? "bn" : "en")}
          className="w-full rounded-xl border border-[#ACC822] px-4 py-2 font-medium text-[#ACC822] transition hover:bg-[#ACC822] hover:text-white"
        >
          {language === "en" ? "বাংলা" : "English"}
        </button>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-200 p-5">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-400 px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <LogOut size={20} />

          {dictionary.menu.logout}
        </button>
      </div>
    </aside>
  );
}
