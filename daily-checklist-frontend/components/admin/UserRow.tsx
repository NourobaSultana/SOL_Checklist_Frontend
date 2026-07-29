'use client';

import toast from 'react-hot-toast';

import {
  deleteUser,
  updateUserRole,
} from '@/services/users';

interface Props {
  user: any;
  refresh: () => void;
}

export default function UserRow({
  user,
  refresh,
}: Props) {
  async function handleRole() {
    try {
      const nextRole =
        user.role === 'user'
          ? 'sub_admin'
          : 'user';

      await updateUserRole(
        user._id,
        nextRole,
      );

      toast.success('Role updated.');

      refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          'Failed to update role.',
      );
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      'Delete this user?',
    );

    if (!confirmed) return;

    try {
      await deleteUser(user._id);

      toast.success('User deleted.');

      refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          'Delete failed.',
      );
    }
  }

  return (
    <tr className="border-b">
      <td className="p-4">{user.name}</td>

      <td>{user.email}</td>

      <td>
        <span className="rounded bg-slate-100 px-3 py-1">
          {user.role}
        </span>
      </td>

      <td className="space-x-2">
        {user.role !== 'admin' && (
          <>
            <button
              onClick={handleRole}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              {user.role === 'user'
                ? 'Make Sub Admin'
                : 'Make User'}
            </button>

            <button
              onClick={handleDelete}
              className="rounded bg-red-600 px-4 py-2 text-white"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}