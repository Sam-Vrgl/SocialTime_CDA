// src/components/RequireAuth.tsx
'use client';

import { useContext, ReactNode, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user } = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    // if user is explicitly null (i.e. not logged in), redirect
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  // while we’re figuring out auth, or redirecting, show a loader
  if (user === undefined || user === null) {
    return <p>Loading…</p>;
  }

  return <>{children}</>;
}
