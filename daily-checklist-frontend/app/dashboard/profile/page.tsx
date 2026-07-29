'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { getProfile } from '@/services/users';
import { changePassword } from '@/services/users';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const data = await getProfile();
    setUser(data);
  }

  if (!user) {
    return <p>Loading...</p>;
  }


  async function handleChangePassword() {
  try {
    await changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    alert('Password updated successfully');

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (error: any) {
    alert(
      error?.response?.data?.message ||
        'Failed to change password'
    );
  }
}

  return (
    <div className="space-y-6">

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="flex items-center gap-5">

          <img
            src={
              user.avatar
                ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${user.avatar}`
                : '/avator.png'
            }
            className="h-28 w-28 rounded-full border object-cover"
          />

          <div>

            <h1 className="text-3xl font-bold">
              {user.name}
            </h1>

            <p className="text-gray-500">
              {user.email}
            </p>

            <span className="mt-2 inline-block rounded bg-[#ACC822] px-3 py-1 text-white">
              {user.role}
            </span>

          </div>

        </div>


        <div className="rounded-2xl bg-white p-6 shadow mt-6">
  <h2 className="mb-4 text-xl font-semibold">
    Change Password
  </h2>

  <input
    type="password"
    placeholder="Current Password"
    value={currentPassword}
    onChange={(e) =>
      setCurrentPassword(e.target.value)
    }
    className="mb-3 w-full rounded-lg border p-3"
  />

  <input
    type="password"
    placeholder="New Password"
    value={newPassword}
    onChange={(e) =>
      setNewPassword(e.target.value)
    }
    className="mb-3 w-full rounded-lg border p-3"
  />

  <input
    type="password"
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(e.target.value)
    }
    className="mb-4 w-full rounded-lg border p-3"
  />

  <button
    onClick={handleChangePassword}
    className="rounded-lg bg-[#ACC822] px-5 py-2 text-white hover:bg-[#96b51d]"
  >
    Update Password
  </button>
</div>

      </div>

    </div>
  );
}