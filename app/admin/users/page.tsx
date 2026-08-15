'use client';

import { useEffect, useState } from 'react';

import Loader from '@/components/ui/Loader';

import UserTable from '@/components/admin/UserTable';

import { getUsers } from '@/services/users';

export default function UsersPage() {
  const [users, setUsers] = useState<
    any[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  async function loadUsers() {
    try {
      const data = await getUsers();

      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        User Management
      </h1>

      <UserTable
        users={users}
        refresh={loadUsers}
      />
    </div>
  );
}