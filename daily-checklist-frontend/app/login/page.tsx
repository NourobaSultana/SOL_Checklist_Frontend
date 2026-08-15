"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { loginUser } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      await login(data.access_token);

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {" "}
            Sign In to Your Account ✨{" "}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your credentials to continue securely
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
              {/* <FaEnvelope className="text-gray-400" /> */}

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 transition-all duration-300 focus-within:border-[#7c9e1a] focus-within:ring-2 focus-within:ring-indigo-200">
              {/* <FaLock className="text-gray-400" /> */}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-[#7c9e1a]  transition-colors "
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-[#7c9e1a] hover:text-[#96b51d] transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          {/* from-[#7C9E1A] via-[#96B51D] */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#7c9e1a] py-3 text-white font-semibold transition-all duration-300 hover:bg-[#96b51d] hover:shadow-lg hover:scale-[1.02] active:scale-95"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?
          <Link href="/register">
            <span className="cursor-pointer font-semibold text-[#7c9e1a] hover:text-[#96b51d]">
              Register
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
