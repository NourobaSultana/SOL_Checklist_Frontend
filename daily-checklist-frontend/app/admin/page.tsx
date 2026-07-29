import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/admin/users"
          className="rounded-xl bg-white p-8 shadow hover:shadow-lg"
        >
          <h2 className="text-2xl font-bold">
            Users
          </h2>

          <p className="text-gray-500 mt-2">
            Manage all users
          </p>
        </Link>

        <Link
          href="/admin/history"
          className="rounded-xl bg-white p-8 shadow hover:shadow-lg"
        >
          <h2 className="text-2xl font-bold">
            Checklist History
          </h2>

          <p className="text-gray-500 mt-2">
            View all submitted checklists
          </p>
        </Link>
      </div>
    </div>
  );
}