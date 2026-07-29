'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Link from 'next/link';


import { registerUser } from '@/services/auth';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        password,
      });

        toast.success(
        'Registration successful. Please login.',
      );

      router.push('/login');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          'Registration failed',
      );
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
            Create Account ✨
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to get started with your dashboard
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full outline-none bg-transparent"
                value={name}
                onChange={(e) =>
                setName(e.target.value)
            }
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none bg-transparent"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
              <input
                type="password"
                placeholder="Create a password"
                className="w-full outline-none bg-transparent"
                value={password}
                onChange={(e) =>
                setPassword(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-500">
              I agree to the{" "}
              <span className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-95"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};







//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleRegister}
//         className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
//       >
//         <h1 className="mb-6 text-center text-3xl font-bold">
//           Register
//         </h1>

//         <div className="space-y-4">
//           <Input
//             label="Name"
//             placeholder="Enter name"
//             value={name}
//             onChange={(e) =>
//               setName(e.target.value)
//             }
//           />

//           <Input
//             label="Email"
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) =>
//               setEmail(e.target.value)
//             }
//           />

//           <Input
//             label="Password"
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) =>
//               setPassword(e.target.value)
//             }
//           />
//         </div>

//         <div className="mt-6">
//           <Button
//             type="submit"
//             disabled={loading}
//           >
//             {loading
//               ? 'Registering...'
//               : 'Register'}
//           </Button>
//         </div>

//         <p className="mt-6 text-center">
//           Already have an account?{' '}
//           <a
//             href="/login"
//             className="text-blue-600"
//           >
//             Login
//           </a>
//         </p>
//       </form>
//     </main>
//   );
// }