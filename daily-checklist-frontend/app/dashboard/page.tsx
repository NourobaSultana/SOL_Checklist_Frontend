'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="rounded-3xl border p-5 sm:p-6">
      <h1 className="mb-8 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/dashboard/checklist"
          className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
        >
          <h2 className="text-xl font-bold">
            Today's Checklist
          </h2>

          <p className="mt-3 text-gray-500">
            Fill today's checklist.
          </p>
        </Link>

        <Link
          href={
            user?.role === "admin"
              ? "/admin/history"
              : "/dashboard/history"
          }
          className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
        >
          <h2 className="text-xl font-bold">
            History
          </h2>

          <p className="mt-3 text-gray-500">
            View previous submissions.
          </p>
        </Link>
      </div>
    </div>
  );
}