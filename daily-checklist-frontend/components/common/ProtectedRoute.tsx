'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Loader from '../ui/Loader';

import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}