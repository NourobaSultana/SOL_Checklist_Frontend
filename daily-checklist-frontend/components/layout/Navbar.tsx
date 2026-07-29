'use client';

import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white-50 px-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-[#ACC822]">
          Welcome back 👋
        </h1>
      </div>

      <div className="text-right">
        <h2 className="font-semibold">
          {user?.name}
        </h2>

        <p className="text-sm text-gray-500">
          {user?.email}
        </p>
      </div>
    </header>
  );
}