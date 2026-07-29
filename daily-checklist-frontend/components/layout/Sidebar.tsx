'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  ClipboardCheck,
  History,
  User,
  LogOut,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

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
    <aside className="flex h-screen w-64 rounded 3xl border flex-col bg-white-50 text-gray-800">
      <div className="border-b border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-[#ACC822]">
          SOL Checklist
        </h2>

        <p className="text-sm text-gray-500">
          Checklist
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                pathname === menu.href
                 ? 'bg-[#ACC822] text-white'
                  : 'hover:bg-[#ACC822]/15 hover:text-[#ACC822]'
              }`}
            >
              <Icon size={20} />

              {menu.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg bg-red-500 px-4 py-3 transition hover:bg-red-600"
        >
          <LogOut size={20} />

          Logout
        </button>
      </div>
    </aside>
  );
}