"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getProfile } from "@/services/users";
import { changePassword } from "@/services/users";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

      alert("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to change password");
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#84A81A] via-[#ACC822] to-[#D6EE5B] p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
            {/* Avatar */}
            <div className="flex shrink-0 justify-center">
              <img
                src={
                  user.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${user.avatar}`
                    : "/avator.png"
                }
                // alt={user.name}
                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg sm:h-24 sm:w-24 lg:h-28 lg:w-28 xl:h-32 xl:w-32"
              />
            </div>

            {/* User Info */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <h1 className="w-full overflow-hidden text-2xl font-bold text-white text-ellipsis whitespace-nowrap sm:text-3xl">
                {user.name}
              </h1>

              <p className="mt-2 break-all text-sm text-white/90 sm:text-base">
                {user.email}
              </p>

              <span className="mt-4 inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold capitalize text-[#84A81A]">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="p-5 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your password to keep your account secure.
            </p>
          </div>

          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current Password
              </label>

              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-[#ACC822] focus:bg-white focus:ring-4 focus:ring-[#ACC822]/20"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-[#ACC822] focus:bg-white focus:ring-4 focus:ring-[#ACC822]/20"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-[#ACC822] focus:bg-white focus:ring-4 focus:ring-[#ACC822]/20"
              />
            </div>

            {/* Button */}
            <div className="pt-2">
              <button
                onClick={handleChangePassword}
                className="w-full rounded-2xl bg-[#ACC822] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96B51D] hover:shadow-lg sm:w-auto"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
